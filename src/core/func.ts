import { tagName } from "./const";
import { ActionGroupOfParent, UserscriptWindow } from "./typing";
/**
 * 重新设置动画
 */
export function reanimation(func: () => void) {
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() => {
      func();
    })
  );
}

/**
 * 当前是否焦点可编辑元素
 */
export function isActiveElementEditable(): boolean {
  const activeElement = document.activeElement as HTMLElement;
  if (!activeElement) return false;
  if (activeElement.isContentEditable) return true;
  if ("value" in activeElement) return true;
  return false;
}

/**
 * 获取一个范围内的数,最小为最小值，最大为最大值
 */
export function between(
  value: number,
  min: number = 0,
  max: number = 1
): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * 顶级窗口
 */
export function topWindow(): UserscriptWindow {
  return unsafeWindow.top!;
}

/**
 * 处理元素父元素，突破 iframe 限制
 */
export function actionOfAllParent(
  el: HTMLElement,
  action: ActionGroupOfParent,
  level = 0
): HTMLElement {
  let parent = el.parentElement;
  if (!parent) return el;

  const currWindow = parent.ownerDocument.defaultView as Window;
  if (parent.tagName == "BODY") {
    if (currWindow == currWindow.top) return el;

    // iframe
    const iframeArr = currWindow.parent.document.querySelectorAll("iframe");
    for (const iframe of iframeArr) {
      if (currWindow != iframe.contentWindow) continue;
      parent = iframe!;
      break;
    }
  }

  // 动作执行
  if (level < 1 && action.self) action.self(el); // self
  if (parent.tagName == tagName.iframe) {
    // iframe
    if (action.iframe) action.iframe(parent);
  } else {
    // parent
    if (!action.parent(parent)) return el;
  }

  return actionOfAllParent(parent, action, level + 1);
}

/**
 * 窗口子窗口
 */
export function actionOfAllSubWindow(
  action: (win: Window) => void,
  isIncludeSelf = true,
  win = topWindow()
) {
  const iframeArr = win.document.querySelectorAll("iframe");
  for (const iframe of iframeArr) {
    if (!iframe.contentDocument || !iframe.contentWindow) continue;
    actionOfAllSubWindow(action, true, iframe.contentWindow);
  }
  if (isIncludeSelf) action(win);
}
