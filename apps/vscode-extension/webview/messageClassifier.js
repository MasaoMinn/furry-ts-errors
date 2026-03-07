const CHINESE_TO_ENGLISH_MAP = {
  钩子: "hook",
  副作用: "useeffect",
  状态: "usestate",
  记忆: "usememo",
  回调: "usecallback",

  子元素: "child",
  未定义: "properties of undefined",
  属性: "cannot read property",
  唯一的: 'each child in a list should have a unique "key"',
  水合: "hydrate",
  水合作用: "hydration",
  匹配: "match",
  服务端: "expected server",
  jsx元素: "jsx elements",
  执行失败: "failed to execute",
  追加子节点: "appendchild",
  移除子节点: "removechild",

  找不到: "not found",
  导入: "import",
  模块: "module",
  导出: "export",
  变体: "varient",
  查找: "find",

  setup脚本: "setup script",
  组合: "composition api",
  响应式: "reactive()",
  计算属性: "computed()",
  组件模板: "component template",

  可分配: "assignable",
  类型: "typeerror",
  不是: "is not",
  转换: "cannot convert",
  读取属性: "read properties",
  实例: "instanceof",
  原型: "prototype",

  错误: "error",
  警告: "warning",
  诊断: "diagnostic",
  美化后的诊断信息: "prettified diagnostic",
};
function convertChineseErrorToEnglish(text) {
  if (!text) return "";
  let processedText = text.toLowerCase();
  Object.entries(CHINESE_TO_ENGLISH_MAP).forEach(([chineseKey, englishKey]) => {
    const regex = new RegExp(chineseKey, "g");
    processedText = processedText.replace(regex, englishKey);
  });

  return processedText;
}
function classifyMessage(message) {
  const convertedText = convertChineseErrorToEnglish(message);
  const text = convertedText.toLowerCase();

  if (text.includes("prettified diagnostic")) {
    return "/images/react-furry-moji.png";
  }
  if (
    text.includes("hook") ||
    text.includes("hooks") ||
    text.includes("useeffect") ||
    text.includes("usestate") ||
    text.includes("usememo") ||
    text.includes("usecallback") ||
    text.includes("usereducer")
  ) {
    return "/images/hook.png";
  }

  if (
    text.includes("react child") ||
    text.includes("cannot read properties of undefined") ||
    text.includes("cannot read property") ||
    text.includes('each child in a list should have a unique "key"') ||
    text.includes("hydrate") ||
    text.includes("hydration") ||
    text.includes("did not match") ||
    text.includes("expected server html") ||
    text.includes("adjacent jsx elements") ||
    text.includes("failed to execute") ||
    text.includes("appendchild") ||
    text.includes("removechild") ||
    text.includes("dom") ||
    text.includes("doms")
  ) {
    return "/images/dom.png";
  }

  if (
    text.includes("found") ||
    text.includes("find") ||
    text.includes("varient") ||
    text.includes("import") ||
    text.includes("module") ||
    text.includes("export")
  ) {
    return "/images/not_found_wink.png";
  }

  return "/images/confused.png";
}

// 原additionalClassifier函数改造：同样集成转换逻辑
function additionalClassifier(message) {
  // 新增：先转换中文报错词为英文
  const convertedText = convertChineseErrorToEnglish(message);
  const text = convertedText.toLowerCase();

  const vueErrorPatterns = [
    /vue/,
    /setup script/,
    /composition api/,
    /ref\(\)/,
    /reactive\(\)/,
    /computed\(\)/,
    /watch\(/,
    /use.*hook/,
    /defineprops/,
    /defineemits/,
    /defineexpose/,
    /component template/,
    /pinia/,
  ];
  if (vueErrorPatterns.some((pattern) => pattern.test(text))) {
    return "/images/onVue.png";
  }

  if (
    text.includes("assignable") ||
    text.includes("typeerror") ||
    text.includes("is not") ||
    text.includes("cannot convert") ||
    text.includes("read properties") ||
    text.includes("instanceof") ||
    text.includes("prototype")
  ) {
    return "/images/type.png";
  }

  return null;
}

// ========== 第四步：挂载全局（保持原有逻辑） ==========
window.classifyMessage = classifyMessage;
window.additionalClassifier = additionalClassifier;
window.convertChineseErrorToEnglish = convertChineseErrorToEnglish; // 可选：暴露转换函数供调试

// console.log(classifyMessage("react钩子错误"));
// console.log(classifyMessage("找不到xxx文件"));
// console.log(classifyMessage("组件树渲染"));
// console.log(classifyMessage("react钩子错误"));
