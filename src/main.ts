import "./style/style.scss";
import * as Action from "./core/action";
import { isActiveElementEditable, isExistMedia } from "./core/func";

document.addEventListener("keydown", (e) => {
  // 元素可编辑 或 未包含播放器元组件 忽略当前事件
  if (isActiveElementEditable() || !isExistMedia()) return;

  let hasAction = true;
  switch (true) {
    case e.code == "Enter":
      new Action.Fullscreen().toggle();
      break;
    case e.code == "Space":
      new Action.PlayState().toggle();
      break;
    case e.shiftKey && e.code == "KeyA":
      new Action.CurrentTime().sub();
      break;
    case e.shiftKey && e.code == "KeyD":
      new Action.CurrentTime().add();
      break;
    case e.shiftKey && e.code == "KeyW":
      new Action.Volume().add();
      break;
    case e.shiftKey && e.code == "KeyS":
      new Action.Volume().sub();
      break;
    case e.shiftKey && e.code == "KeyZ":
      new Action.PlaybackRate().sub();
      break;
    case e.shiftKey && e.code == "KeyX":
      new Action.PlaybackRate().restart();
      break;
    case e.shiftKey && e.code == "KeyC":
      new Action.PlaybackRate().add();
      break;
    case e.ctrlKey && e.shiftKey && e.code == "BracketRight":
      new Action.PictureInPicture().toggle();
      break;
    case e.shiftKey && e.code == "KeyO":
      new Action.MovieMode().toggle();
      break;
    case e.shiftKey && e.code == "KeyH":
      new Action.Mirror().toggle();
      break;
    case e.shiftKey && e.code == "KeyL":
      new Action.Loop().toggle();
      break;
    case e.shiftKey && e.code == "KeyM":
      new Action.Muted().toggle();
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
