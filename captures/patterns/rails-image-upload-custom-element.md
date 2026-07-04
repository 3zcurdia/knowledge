# Reusable Drag-and-Drop Image Upload Custom Element in Rails

A self-contained Web Component (`<image-upload>`) for drag-and-drop image uploads in Rails forms. Unlike Stimulus controllers, custom elements work anywhere without data attributes or controller targets — just drop the tag in your view.

## How It Works

The component creates its own hidden file input and appends it directly to the form (found automatically or via `form` attribute). It handles drag-and-drop with visual feedback via `data-drag-active`, renders previews using `FileReader`, and supports removal via a `data-remove-image` button.

## Usage

Inside a form (auto-detected):
```erb
<image-upload name="user[avatar]" data-preview-image-url="<%= url_for(@user.avatar) if @user.avatar.attached? %>">
  <button type="button" data-remove-image>Remove</button>
</image-upload>
```

Outside a form (explicit ID):
```erb
<image-upload name="user[header]" form="user_form">
  <button type="button" data-remove-image>Remove</button>
</image-upload>
```

## Key Design Decisions

- File input is appended to the form, not the component, so Rails params receive it.
- `form` attribute enables use outside the form element.
- For `has_one_attached`, submitting an empty file input removes the attachment.

## See also

- [Custom HTML Elements in LLM Chat Responses](custom-html-elements-llm-chat.md)

> Source: inbox/articles/Reusable drag-and-drop image preview in Rails.md · processed 2026-07-02
