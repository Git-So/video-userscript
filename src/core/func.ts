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
