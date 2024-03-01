import ResizeObserver from 'resize-observer-polyfill';

// 每个ResizeObserver实例可以同时监听多个目标元素
// 封装一个全局的ResizeObserver，在需要的时候调用
export const GlobalResizeObserver = (function () {
  // 定义一个属性名称，用于在DOM元素上存储关联的回调函数标识符
  const ATTR_NAME = 'global-charts-resizeobserver-key';

  // 创建一个对象，用于存储根据属性值映射到的回调函数
  const attrValueToCallback: any = {};

  // 创建一个resizeObserver实例, 监听尺寸变化事件
  const resizeObserver = new ResizeObserver((entries) => {
    // 遍历所有触发尺寸变化的DOM元素，这里监听的是图表的父元素，一般为容器
    for (const entry of entries) {
      // 获取当前发生变化的目标DOM元素
      const resizedElement = entry.target;
      // 为每一个目标元素增加观测的属性，用于构建对象保存每个被监听元素对应的callback
      const attrValue = resizedElement.getAttribute(ATTR_NAME);
      if (attrValue) {
        // 根据属性值从映射对象中获取相应的回调函数
        const callback = attrValueToCallback[attrValue];
        if (typeof callback === 'function') {
          callback(entry);
        }
      }
    }
  });

  return Object.freeze({
    /**
     * 开始监听指定DOM元素的尺寸变化
     * @param { Element } element - 要监听的DOM元素
     * @param { (ResizeObserverEntry) => {} } callback - 当元素尺寸变化时调用的回调函数
     */
    observe(element: Element, callback: any) {
      if (!(element instanceof Element)) {
        console.error('没有元素无法监听');
        return;
      }

      let attrValue = element.getAttribute(ATTR_NAME);
      if (!attrValue) {
        attrValue = String(Math.random());
        element.setAttribute(ATTR_NAME, attrValue);
      }

      // 将回调函数与属性值关联，并存入映射对象中
      attrValueToCallback[attrValue] = callback;

      // 使用ResizeObserver实例开始观察指定的DOM元素
      resizeObserver.observe(element);
    },

    /**
     * 停止监听指定DOM元素的尺寸变化
     * @param { Element } element - 要停止监听的DOM元素
     */
    unobserve(element: Element) {
      if (!(element instanceof Element)) {
        console.error('没有元素无法监听');
        return;
      }

      // 如果找到了属性值，则从映射对象中移除关联的回调函数
      const attrValue = element.getAttribute(ATTR_NAME);
      if (!attrValue) {
        return;
      }
      delete attrValueToCallback[attrValue];

      // 使用ResizeObserver实例停止观察指定的DOM元素
      resizeObserver.unobserve(element);
    },
  });
})();
