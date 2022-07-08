import "./style/style.scss";
import * as Action from "./core/action";
import { isActiveElementEditable } from "./core/func";
import { Video } from "./core/video";

document.addEventListener("keydown", (e) => {
  // 元素可编辑 或 未包含播放器元组件 忽略当前事件
  if (isActiveElementEditable() || !Video.media) return;

  let hasAction = true;
  switch (true) {
    case e.code == "Enter":
      new Action.Fullscreen().toggle();
      break;
    case e.code == "Space":
      new Action.PlayState().toggle();
      break;
    default:
      hasAction = false;
  }
  if (!hasAction) return; // 未执行事件

  // 事件冒泡
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.preventDefault();
});

export {};
