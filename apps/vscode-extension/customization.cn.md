# Furry TS Errors 自定义配置指南

本文介绍如何在 VS Code 中自定义 Furry TS Errors 的图片与显示行为。

## 配置入口

### 方法一：命令面板

1. 打开命令面板（`Ctrl+Shift+P`）
2. 输入 `Furry TS Errors: Configure Error Images`
3. 可进行以下操作：
   - **Set: ...**：为某个主图片选择本地文件
   - **...: On/Off**：切换 Vue / Type 附加图片显示
   - **Reset to default**：将图片路径与显示开关全部恢复为默认值

### 方法二：修改 settings.json

1. 打开 VS Code 设置（`Ctrl+,`）
2. 搜索 `furry-ts-errors`
3. 你会看到两类配置：
   - `furry-ts-errors.images`：主图片路径配置
   - `furry-ts-errors.imageVisibility`：附加图片（Vue / Type）显示开关

## 可配置项说明

### 1. `furry-ts-errors.images`

用于配置主图片路径，支持以下键：

- `confused` - 困惑表情
- `hook` - Hook 相关错误
- `dom` - DOM 相关错误
- `notFoundWink` - 未找到错误（眨眼）
- `reactFurryMoji` - React 相关错误

**默认配置：**

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

**路径规则：**

- 支持绝对路径（如 `D:\\pics\\hook.png`）
- 支持 `file:///` URI
- 支持相对路径（会尝试相对于扩展目录/工作区目录解析）
- 建议使用 `png`/`jpg`/`jpeg`/`svg`/`gif`/`webp`（能套进 `<img>` 标签的 src 就行）

### 2. `furry-ts-errors.imageVisibility`

用于控制附加图片是否显示：

- `onVue`：Vue 表情包图片开关
- `type`：Type 表情包图片开关

**默认配置：**

```json
{
  "furry-ts-errors.imageVisibility": {
    "onVue": true,
    "type": true
  }
}
```

## 完整配置示例

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

## 常见问题

### 修改后没有生效

- 重新选择报错位置，触发侧栏刷新
- 检查路径是否可访问、扩展名是否正确
- 使用 **Reset to default** 回到默认配置后再逐项调整

### 只想关闭 Vue / Type 的附加图

将以下配置设为 `false`：

```json
{
  "furry-ts-errors.imageVisibility": {
    "onVue": false,
    "type": false
  }
}
```

## 注意事项

- 修改配置后可能需要重启 VS Code 或重新打开相关文件才能生效
- 建议使用相对路径以确保配置在不同环境中的可移植性
- 如果遇到图片显示问题，请检查文件路径和权限设置