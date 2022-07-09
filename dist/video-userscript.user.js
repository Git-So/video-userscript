// ==UserScript==
// @name              Video Userscript
// @version           1657350488
// @description       HTML5 视频增强脚本
// @author            So
// @namespace         site.sooo.userscript.video
// @match             http://*/*
// @match             https://*/*
// @grant             GM_addStyle
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  GM_addStyle(`
@charset "UTF-8";
@keyframes toast-show {
  from {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.sooo--video {
  /**
  * 动作提示
  */
  /**
  * 关灯影院模式
  */
}
.sooo--video-action-toast {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 10px 15px;
  font-size: 1.5em;
  color: whitesmoke;
  background-color: rgba(0, 0, 0, 0.555);
  z-index: 9000;
}
.sooo--video-action-toast-animation {
  animation: toast-show 1.2s alternate forwards;
}
.sooo--video-movie-mode {
  z-index: 99999999 !important;
}
.sooo--video-movie-mode-parent {
  z-index: auto !important;
}
.sooo--video-movie-mode-modal {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed !important;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000000;
}  `);
  var style = "";
  const value = [
    {
      match: `^https?://www.bilibili.com/video/`,
      player: "#bilibili-player .bpx-player-container .bpx-player-video-area"
    }
  ];
  class Video {
    rule() {
      for (const rule of value) {
        const rg = new RegExp(rule.match);
        if (location.href.search(rg) > -1)
          return rule;
      }
      return null;
    }
    defaultMedia() {
      var _a;
      const items = document.querySelectorAll("video");
      let media = (_a = items[0]) != null ? _a : null;
      for (const item of items) {
        if (!item.paused)
          break;
        media = item;
      }
      return media;
    }
    defaultPlayer(media = null) {
      let player = media != null ? media : this.defaultMedia();
      if (!player)
        return null;
      return actionByAncestor(player, (parent) => {
        return parent.clientHeight == (player == null ? void 0 : player.clientHeight) && parent.clientWidth == (player == null ? void 0 : player.clientWidth);
      });
    }
    media() {
      const rule = this.rule();
      if (rule) {
        if (rule.media)
          return document.querySelector(rule.media);
        return document.querySelector(`${rule.player} video`);
      }
      return this.defaultMedia();
    }
    player(media = null) {
      const rule = this.rule();
      if (rule)
        return document.querySelector(rule.player);
      return this.defaultPlayer(media);
    }
  }
  function actionByAncestor(element, action) {
    for (let _i = 0; _i < 500; _i++) {
      const parent = element.parentElement;
      if (!parent || parent.tagName == "BODY")
        break;
      if (!action(parent))
        break;
      element = parent;
    }
    return element;
  }
  function reanimation(func) {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      func();
    }));
  }
  function toast(player, text) {
    if (!player)
      return;
    const className = "sooo--video-action-toast";
    const animationClassName = "sooo--video-action-toast-animation";
    if (!player.querySelector(`.${className}`)) {
      const element = document.createElement("DIV");
      element.classList.add(className);
      player.append(element);
    }
    const toast2 = player.querySelector(`.${className}`);
    toast2.classList.remove(animationClassName);
    toast2.innerHTML = "";
    toast2.append(text);
    reanimation(() => {
      toast2.classList.add(animationClassName);
    });
  }
  function isActiveElementEditable() {
    const activeElement = document.activeElement;
    if (!activeElement)
      return false;
    if (activeElement.isContentEditable)
      return true;
    if ("value" in activeElement)
      return true;
    return false;
  }
  function isExistMedia() {
    return !!new Video().media();
  }
  function between(value2, min = 0, max = 1) {
    if (value2 < min)
      return min;
    if (value2 > max)
      return max;
    return value2;
  }
  class Action {
    constructor() {
      __publicField(this, "_name", "");
      __publicField(this, "video", new Video());
      __publicField(this, "_media", null);
      __publicField(this, "_player", null);
    }
    get name() {
      return this._name;
    }
    get media() {
      if (!this._media)
        this._media = this.video.media();
      return this._media;
    }
    get player() {
      if (!this._player)
        this._player = this.video.player(this.media);
      return this._player;
    }
    safeAction(action, that = this) {
      if (!this.media)
        return;
      action.apply(that);
    }
    toast(text) {
      toast(this.player, text);
    }
  }
  class SwitchAction extends Action {
    get isEnable() {
      return false;
    }
    enableAction() {
    }
    enable() {
      this.safeAction(this.enableAction);
      this.toast(`${this.name}: \u5F00`);
    }
    disableAction() {
    }
    disable() {
      this.safeAction(this.disableAction);
      this.toast(`${this.name}: \u5173`);
    }
    toggle() {
      this.isEnable ? this.disable() : this.enable();
    }
  }
  class StepAction extends Action {
    constructor() {
      super(...arguments);
      __publicField(this, "step", 1);
    }
    setValue(_value, _isStep = true) {
    }
    add(step = this.step) {
      this.setValue(+step);
    }
    sub(step = this.step) {
      this.setValue(-step);
    }
  }
  class Fullscreen extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u5168\u5C4F");
    }
    get isEnable() {
      return !!document.fullscreenElement;
    }
    enableAction() {
      var _a;
      (_a = this.player) == null ? void 0 : _a.requestFullscreen();
    }
    disableAction() {
      document.exitFullscreen();
    }
  }
  class PlayState extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u64AD\u653E");
    }
    get isEnable() {
      var _a;
      return !((_a = this.media) == null ? void 0 : _a.paused);
    }
    enableAction() {
      var _a;
      (_a = this.media) == null ? void 0 : _a.play();
    }
    disableAction() {
      var _a;
      (_a = this.media) == null ? void 0 : _a.pause();
    }
  }
  class PictureInPicture extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u753B\u4E2D\u753B");
    }
    get isEnable() {
      return !!document.pictureInPictureElement;
    }
    enableAction() {
      var _a;
      (_a = this.media) == null ? void 0 : _a.requestPictureInPicture();
    }
    disableAction() {
      if (!this.isEnable)
        return;
      document.exitPictureInPicture();
    }
  }
  class CurrentTime extends StepAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u89C6\u9891\u8FDB\u5EA6");
      __publicField(this, "step", 10);
    }
    setValue(value2, isStep = true) {
      this.safeAction(() => {
        const currentTime = isStep ? this.media.currentTime + value2 : value2;
        this.media.currentTime = currentTime;
        this.toast(`${this.name}: ${value2 < 0 ? "" : "+"}${value2}\u79D2`);
      });
    }
  }
  class Volume extends StepAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u97F3\u91CF");
      __publicField(this, "step", 0.1);
    }
    setValue(value2, isStep = true) {
      this.safeAction(() => {
        const volume = isStep ? this.media.volume + value2 : value2;
        this.media.volume = between(volume, 0, 1);
        this.toast(`${this.name}:${this.media.volume * 100 | 0}% `);
      });
    }
  }
  class PlaybackRate extends StepAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u500D\u6570\u64AD\u653E");
      __publicField(this, "step", 1);
      __publicField(this, "playbackRate", [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 5]);
      __publicField(this, "defaultIdx", 3);
    }
    get currIdx() {
      if (!this.media)
        return this.defaultIdx;
      const idx = this.playbackRate.indexOf(this.media.playbackRate);
      return idx < 0 ? this.defaultIdx : idx;
    }
    setValue(value2, isStep = true) {
      this.safeAction(() => {
        value2 = isStep ? this.currIdx + value2 : value2;
        const idx = between(value2, 0, this.playbackRate.length - 1);
        const rate = this.playbackRate[idx];
        this.media.playbackRate = rate;
        this.toast(`${this.name}: ${rate}x`);
      });
    }
    restart() {
      this.setValue(this.defaultIdx, false);
    }
  }
  class MovieMode extends SwitchAction {
    constructor() {
      super(...arguments);
      __publicField(this, "_name", "\u5F71\u9662\u6A21\u5F0F");
      __publicField(this, "className", "sooo--video-movie-mode");
      __publicField(this, "parentClassName", "sooo--video-movie-mode-parent");
      __publicField(this, "modalClassName", "sooo--video-movie-mode-modal");
    }
    get isEnable() {
      var _a;
      return !!((_a = this.player) == null ? void 0 : _a.classList.contains(this.className));
    }
    enableAction() {
      var _a;
      (_a = this.player) == null ? void 0 : _a.classList.add(this.className);
      document.body.append((() => {
        const modal = document.createElement("DIV");
        modal.className = this.modalClassName;
        return modal;
      })());
      actionByAncestor(this.player, (element) => {
        element.classList.add(this.parentClassName);
        return true;
      });
    }
    disableAction() {
      var _a, _b;
      (_a = this.player) == null ? void 0 : _a.classList.remove(this.className);
      (_b = document.querySelector(`.${this.modalClassName}`)) == null ? void 0 : _b.remove();
      document.querySelectorAll(`.${this.parentClassName}`).forEach((el) => {
        el.classList.remove(this.parentClassName);
      });
    }
  }
  document.addEventListener("keydown", (e) => {
    if (isActiveElementEditable() || !isExistMedia())
      return;
    let hasAction = true;
    switch (true) {
      case e.code == "Enter":
        new Fullscreen().toggle();
        break;
      case e.code == "Space":
        new PlayState().toggle();
        break;
      case (e.shiftKey && e.code == "KeyA"):
        new CurrentTime().sub();
        break;
      case (e.shiftKey && e.code == "KeyD"):
        new CurrentTime().add();
        break;
      case (e.shiftKey && e.code == "KeyW"):
        new Volume().add();
        break;
      case (e.shiftKey && e.code == "KeyS"):
        new Volume().sub();
        break;
      case (e.shiftKey && e.code == "KeyZ"):
        new PlaybackRate().sub();
        break;
      case (e.shiftKey && e.code == "KeyX"):
        new PlaybackRate().restart();
        break;
      case (e.shiftKey && e.code == "KeyC"):
        new PlaybackRate().add();
        break;
      case (e.ctrlKey && e.shiftKey && e.code == "BracketRight"):
        new PictureInPicture().toggle();
        break;
      case (e.shiftKey && e.code == "KeyO"):
        new MovieMode().toggle();
        break;
      default:
        hasAction = false;
    }
    if (!hasAction)
      return;
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  });
})();
