import "./style/style.scss";
import { isActiveElementEditable } from "./core/func";
import * as Action from "./core/action";
import { Video } from "./core/video";

document.addEventListener("keydown", (e) => {

  // 元素可编辑 或 未包含播放器元组件 忽略当前事件
  if (isActiveElementEditable() || Video.isNotExistPlayer()) return;

  // 退出脚本
  const defer = () => {
    // 事件冒泡
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  };

  // 脚本启动开关
  if (e.shiftKey && e.code == "KeyU") {
    new Action.ScriptState().toggle();
  }
  if (Video.isDisable()) return defer();

  // 功能快捷键
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
    case e.shiftKey && e.code == "Digit1":
      new Action.Pirate().open(1);
      break;
    case e.shiftKey && e.code == "Digit2":
      new Action.Pirate().open(2);
      break;
    case e.shiftKey && e.code == "Digit3":
      new Action.Pirate().open(3);
      break;
    case e.shiftKey && e.code == "Digit4":
      new Action.Pirate().open(4);
      break;
    case e.shiftKey && e.code == "Digit5":
      new Action.Pirate().open(5);
      break;
    case e.shiftKey && e.code == "Digit6":
      new Action.Pirate().open(6);
      break;
    case e.shiftKey && e.code == "Digit7":
      new Action.Pirate().open(7);
      break;
    case e.shiftKey && e.code == "Digit8":
      new Action.Pirate().open(8);
      break;
    case e.shiftKey && e.code == "Digit9":
      new Action.Pirate().open(9);
      break;
    default:
      hasAction = false;
  }

  if (!hasAction) return; // 未执行事件
  defer();
});

export {};
