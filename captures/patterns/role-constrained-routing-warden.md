# Role-constrained routing via Warden

Six roles share one Rails app but land on different home pages through a tiny request-matcher object reading the Warden session; the same file gates the Sidekiq dashboard to admins only.

**Project**: internal-app · **Stack**: ruby/rails, devise, warden, sidekiq-web · **Where**: `lib/role_constraint.rb:1`, `config/routes.rb:54`

## Code

```ruby
# lib/role_constraint.rb
class RoleConstraint
  def initialize(*roles)
    @roles = roles
  end

  def matches?(request)
    if request.env['warden'].authenticated?
      @roles.include? request.env['warden'].user.try(:role)
    end
  end
end
```

```ruby
# config/routes.rb
authenticate :user, -> (u) { u.admin? } do
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
end
```

```ruby
# config/routes.rb
devise_scope :user do
  authenticated :user do
    root :to => 'home#status', :constraints => RoleConstraint.new('admin'), as: :admin_root
    root :to => 'home#coach_dashboard', :constraints => RoleConstraint.new('coach'), as: :coach_root
    root :to => 'home#status', :constraints => RoleConstraint.new('user'), as: :user_root
    root :to => 'lesson_topics#index', :constraints => RoleConstraint.new('preuser'), as: :preuser_root
    root :to => 'engagements#index', :constraints => RoleConstraint.new('stakeholder'), as: :stakeholder_root
    root :to => 'profiles#my_profile', :constraints => RoleConstraint.new('registered'), as: :registered_root
    root :to => 'home#index' #matches this route when the above matches don't pass
  end

  #Route if not logged in
  unauthenticated do
    root :to => 'user/sessions#new', as: :unauthenticated_root
  end
end
```

## Why it matters

- Eleven lines replace six controllers or filters: routing itself picks the landing page from `warden.user.role`, so the home controller never branches on role.
- `matches?` returns nil (falsy) for guests instead of raising — unauthenticated roots fall through cleanly.
- `authenticate :user, &:admin?` around `Sidekiq::Web` keeps the ops dashboard inside the same auth stack instead of a separate basic-auth layer.
- Copy for multi-role monoliths with distinct landing pages; prefer Pundit policies (not routes) once authorization moves past the front door.

> Source: inbox/code/internal-app · processed 2026-11-23
