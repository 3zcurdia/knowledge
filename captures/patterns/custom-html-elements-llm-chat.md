# Custom HTML Elements in LLM Chat Responses

ChatGPT uses custom Unicode delimiters (`U+E200`, `U+E201`, `U+E202`) to embed structured UI components (e.g. product carousels) inside Markdown responses. The same approach can be built with Phoenix LiveView, MDEx, and Web Components.

## How ChatGPT Does It

Responses arrive as Server-Sent Events. A carousel is JSON delimited by special Unicode characters that serve as custom syntax markers. The LLM emits these markers inline with normal Markdown text.

## Building Custom Elements in LiveView

### 1. Tell the model about available syntax

Include custom element instructions in the API prompt:

```elixir
instructions: """
You have access to the following custom syntax. ALWAYS use
it to the fullest advantage to provide delightful
rich UI to the user.

# Quick Reply

Use this custom tag to suggest a concise reply
the user can send next. Use multiple quick replies
and keep each one short: 2-4 words.

## Example

<quick-reply>Tell me more</quick-reply>
"""
```

### 2. Configure MDEx to allow the custom tag

```elixir
defmodule BigTalk.Markdown do
  def parser() do
    MDEx.new(
      streaming: true,
      render: [unsafe: true],
      sanitize: sanitize_options()
    )
  end

  def sanitize_options() do
    MDEx.Document.default_sanitize_options()
    |> Keyword.merge(add_tags: ["quick-reply"])
  end
end
```

### 3. Define a Web Component

```javascript
class QuickReply extends HTMLElement {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick)
  }

  handleClick(event) {
    event.preventDefault()
    this.submitReply()
  }

  submitReply() {
    const message = this.textContent.trim()
    const form = document.getElementById("chat-composer-form")
    const input = form?.querySelector("[name='chat[message]']")
    if (!message || !form || !input) return

    input.value = message
    input.dispatchEvent(new Event("input", {bubbles: true}))
    input.dispatchEvent(new Event("change", {bubbles: true}))

    if (form.requestSubmit) {
      form.requestSubmit()
    } else {
      form.dispatchEvent(new SubmitEvent("submit",
        {bubbles: true, cancelable: true}
      ))
    }
  }
}

if (!customElements.get("quick-reply")) {
  customElements.define("quick-reply", QuickReply)
}
```

### 4. Render in the template

```heex
<article>
  {MDEx.to_html!(message.body) |> raw()}
</article>
```

## Key Insight

LLMs are competent at consistently using custom HTML elements when provided with clear syntax instructions. The approach works for more complex elements too — carousels, comparison tables, expandable sections. Equip the model with a menu of custom elements and let it choose the most expressive one for each response.

## See also

- [Reusable Drag-and-Drop Image Upload Custom Element in Rails](rails-image-upload-custom-element.md)

> Source: inbox/articles/Teaching LLMs new UI tricks.md · processed 2026-07-02
