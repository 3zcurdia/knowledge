# Per-client embed snippet with loader and iframe checkout

Clients paste a two-stage JS snippet; the loader injects a per-client compiled bundle, and checkout opens in an iframe overlay that posts a close/redirect message back to the client page.

## Code

v2 used global selector + `*:contains(text)` injection. v3 fixed that with
explicit `.gp-checkout-btn` + iframe + `postMessage`, but kept 5 weaknesses:
dual globals (`_gp` vs `GP`), hardcoded origin, forwards *all* `data-*`,
origin-only message check, `v=` timestamp + `maximum(:updated_at)` per hit.
v4 below fixes all five with the same paste shape.

```ruby
# app/models/client.rb — content version, cached, no per-hit MAX query
def snippet_bundle_version
  Rails.cache.fetch("client/#{id}/snippet_version", expires_in: 1.hour) do
    [updated_at, integrations.maximum(:updated_at)].compact.max.to_i
  end
end

# app/controllers/snippets_controller.rb — sign the session, don't trust data-*
def show
  @token = OpenSSL::HMAC.hexdigest(
    "SHA256", Rails.application.secret_key_base,
    "#{@client.id}:#{@client.snippet_bundle_version}"
  )
end
```

```js
// loader.js.erb — single namespace, origin derived from own src, idempotent
(function () {
  if (window.GP && window.GP.__loaded) return;
  var host = document.currentScript || {};
  var cfg = (host.dataset) || {};
  var bundleUrl = <%= snippet_client_url(client_id: @client.slug, v: @client.snippet_bundle_version).to_json %>;
  var checkoutOrigin = new URL(bundleUrl).origin; // never hardcode, never drift

  window.GP = Object.freeze({
    __loaded: true,
    client: <%= @client.slug.to_json %>,
    platform: <%= params[:platform].to_json %>,
    agentId: <%= params[:agent_id].to_json %>,
    token: <%= @token.to_json %>, // binds iframe session to this client+version
    bundleVersion: <%= @client.snippet_bundle_version.to_json %>,
    checkoutOrigin: checkoutOrigin,
    checkoutBase: checkoutOrigin + "/checkout"
  });

  var pre = document.createElement("link");
  pre.rel = "preconnect"; pre.href = checkoutOrigin;
  document.head.appendChild(pre);

  var s = document.createElement("script");
  s.async = true; s.defer = true;
  s.src = bundleUrl;
  s.onerror = function () { window.GP = { __loaded: false }; };
  document.head.appendChild(s);
})();
```

```js
// embed.js — allowlisted params + token-bound sandboxed overlay
(function () {
  if (!window.GP || !window.GP.checkoutOrigin) return;
  var ORIGIN = window.GP.checkoutOrigin;
  var BTN = ".gp-checkout-btn";
  var active = null; // { iframe, token, prevOverflow }

  // Forward ONLY data-gp-* (v3 forwarded every data-*, leaking internals).
  // Server must still re-validate: data-* is attacker-controlled.
  function checkoutUrl(btn) {
    var qs = new URLSearchParams({
      client: window.GP.client, embed: "1",
      v: String(window.GP.bundleVersion), token: window.GP.token
    });
    btn.getAttributeNames().forEach(function (a) {
      if (a.indexOf("data-gp-") !== 0) return;
      qs.set(a.slice(8).replace(/-/g, "_"), btn.getAttribute(a));
    });
    return window.GP.checkoutBase + "?" + qs.toString();
  }

  function open(btn) {
    close(false);
    var token = Math.random().toString(36).slice(2); // per-open nonce
    var wrap = document.createElement("div");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.5)";
    var frame = document.createElement("iframe");
    frame.src = checkoutUrl(btn) + "&nonce=" + encodeURIComponent(token);
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
    frame.setAttribute("allow", "payment *");
    frame.style.cssText = "position:absolute;inset:5%;width:90%;height:90%;border:0;background:#fff";
    frame.title = "Checkout";
    wrap.appendChild(frame);
    wrap.addEventListener("click", function (e) { if (e.target === wrap) close(true); });
    document.body.appendChild(wrap);
    active = {
      wrap: wrap, iframe: frame, token: token,
      prevOverflow: document.body.style.overflow
    };
    document.body.style.overflow = "hidden";
    frame.focus();
  }

  function close(notify) {
    if (!active) return;
    active.wrap.remove();
    document.body.style.overflow = active.prevOverflow || "";
    active = null;
  }

  // Delegation covers SPA/Turbo-injected buttons — no re-bind, no MutationObserver.
  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest && ev.target.closest(BTN);
    if (!btn) return;
    ev.preventDefault();
    open(btn);
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") close(true);
  });

  window.addEventListener("message", function (ev) {
    if (ev.origin !== ORIGIN) return;
    // v3 checked origin only: any same-origin ad/frame could close + redirect.
    if (!active || ev.source !== active.iframe.contentWindow) return;
    var d = ev.data || {};
    if (d.action !== "close" || d.nonce !== active.token) return;
    var redirect = typeof d.redirect === "string" ? d.redirect : "";
    close(false);
    if (redirect.indexOf(ORIGIN + "/") === 0) {
      window.location.href = redirect;
    }
  });
})();
```

## Why it matters

- v4 keeps v3's shape (tiny loader → per-client bundle → iframe overlay) and
  removes its five remaining holes:
  1. One frozen `window.GP` (was `_gp` + `GP`); origin derived from the
     bundle URL itself, plus `preconnect` — no hardcoded constant to drift.
  2. Forwards only `data-gp-*` (was: every `data-*`, leaking `data-secret`
     etc.). Server re-validates everything — `data-*` is attacker input.
  3. `message` handler checks `origin` **and** `ev.source === iframe` **and**
     per-open `nonce` (was: origin only) — a same-origin ad can no longer
     close checkout or force a redirect.
  4. Sandboxed iframe (`allow-scripts allow-same-origin allow-forms
     allow-popups`), ESC-to-close, backdrop-click close, scroll lock,
     `role=dialog` — v3 had none of this.
  5. Version cached server-side (`Rails.cache`), token-bound with HMAC —
     no per-hit `maximum(:updated_at)`, no `Date.now()` cache killer, no
     client-spoofable session.
- Delete v2 outright: `scope :v2` + `page_scope_selector` (`*:contains(...)`)
  needs jQuery, full-DOM scan, breaks on copy changes, raw-interpolates text.
- Copy v4 for any hosted flow embedded in third-party pages.

## See also

- [Group email dispatch via EmailConstructor and SystemMailer](group-email-dispatch.md)

> Source: inbox/code/internal-app · processed 2026-11-20
