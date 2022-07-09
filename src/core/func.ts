import { Video } from "./video";

/**
 * 操作直系祖宗元素
 * @param element 目标元素
 * @param action 操作的动作
 * @returns 动作返回的元素
 */
export function actionByAncestor(
  element: HTMLElement,
  action: (element: HTMLElement) => boolean
): HTMLElement | null {
  for (let _i = 0; _i < 500; _i++) {
    const parent = element.parentElement;
    if (!parent || parent.tagName == "BODY") break;
    if (!action(parent)) break;
    element = parent;
  }
  return element;
}

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
 * 显示动作提示
 */
export function toast(player: HTMLElement | null, text: string) {
  if (!player) return;

  // 添加提示组件
  const className = "sooo--video-action-toast";
  const animationClassName = "sooo--video-action-toast-animation";
  if (!player.querySelector(`.${className}`)) {
    const element = document.createElement("DIV");
    element.classList.add(className);
    player.append(element);
  }

  // 更新提示组件
  const toast = player.querySelector(`.${className}`)!;
  toast.classList.remove(animationClassName);
  toast.innerHTML = "";
  toast.append(text);

  // 更新动画
  reanimation(() => {
    toast.classList.add(animationClassName);
  });
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
 * 是否存在播放器元组件
 */
export function isExistMedia(): boolean {
  return !!new Video().media();
}
