# Furry TS Errors Customization Guide

This guide explains how to customize Furry TS Errors images and display behavior in VS Code.

## Configuration Methods

### Method 1: Command Palette

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Type `Furry TS Errors: Configure Error Images`
3. You can perform the following operations:
   - **Set: ...**: Select a local file for a specific main image
   - **...: On/Off**: Toggle Vue / Type additional image display
   - **Reset to default**: Restore all image paths and display switches to default values

### Method 2: Modify settings.json

1. Open VS Code Settings (`Ctrl+,`)
2. Search for `furry-ts-errors`
3. You'll see two types of configurations:
   - `furry-ts-errors.images`: Main image path configuration
   - `furry-ts-errors.imageVisibility`: Additional image (Vue / Type) display switches

## Configuration Options

### 1. `furry-ts-errors.images`

Used to configure main image paths, supports the following keys:

- `confused` - Confused expression
- `hook` - Hook-related errors
- `dom` - DOM-related errors
- `notFoundWink` - Not found error (winking)
- `reactFurryMoji` - React-related errors

**Default Configuration:**

```json
{
  "furry-ts-errors.images": {
    "confused": "images/confused.png",
    "hook": "images/hook.png",
    "dom": "images/dom.png",
    "notFoundWink": "images/not_found_wink.png",
    "reactFurryMoji": "images/react-furry-moji.png"
  }
}
```

**Path Rules:**

- Supports absolute paths (e.g., `D:\\pics\\hook.png`)
- Supports `file:///` URI
- Supports relative paths (will try to resolve relative to extension directory/workspace directory)
- Recommended formats: `png`/`jpg`/`jpeg`/`svg`/`gif`/`webp` (any format that can be used in `<img>` tag src)

### 2. `furry-ts-errors.imageVisibility`

Used to control whether additional images are displayed:

- `onVue`: Vue sticker image switch
- `type`: Type sticker image switch

**Default Configuration:**

```json
{
  "furry-ts-errors.imageVisibility": {
    "onVue": true,
    "type": true
  }
}
```

## Complete Configuration Example

```json
{
  "furry-ts-errors.images": {
    "confused": "D:\\assets\\furry\\confused.png",
    "hook": "D:\\assets\\furry\\hook.png",
    "dom": "D:\\assets\\furry\\dom.png",
    "notFoundWink": "D:\\assets\\furry\\not_found.png",
    "reactFurryMoji": "D:\\assets\\furry\\ok.png"
  },
  "furry-ts-errors.imageVisibility": {
    "onVue": false,
    "type": true
  }
}
```

## Frequently Asked Questions

### Changes not taking effect

- Reselect error location to trigger sidebar refresh
- Check if the path is accessible and file extension is correct
- Use **Reset to default** to restore default configuration and then adjust items one by one

### Only want to disable Vue / Type additional images

Set the following configuration to `false`:

```json
{
  "furry-ts-errors.imageVisibility": {
    "onVue": false,
    "type": false
  }
}
```

## Important Notes

- After modifying configuration, you may need to restart VS Code or reopen relevant files for changes to take effect
- Using relative paths is recommended to ensure configuration portability across different environments
- If you encounter image display issues, check file paths and permission settings