import rules from "../rules";
import { Config } from "./config";
import { actionOfAllParent, reanimation } from "./func";
import { Rule, VideoConfig } from "./typing";

export class Video {
  config: VideoConfig;

  private static _instance: Video;
  private constructor() {
    this.config = new Config().value;
  }

  static get instance(): Video {
    if (!Video._instance) {
      Video._instance = new Video();
    }
    return this._instance;
  }

  set lastElement(el: HTMLVideoElement | null) {
    this.config.lastElement = el;
  }
  get lastElement(): HTMLVideoElement | null {
    return this.config.lastElement;
  }

  /**
   * 获取当前网站播放器规则
   */
  private rule(): Rule | null {
    for (const rule of rules) {
      const rg = new RegExp(rule.match);
      if (location.href.search(rg) > -1) return rule;
    }
    return null;
  }

  /**
   * 是否存在播放器
   */
  static isExistPlayer() {
    return !!Video.instance.player();
  }
  static isNotExistPlayer() {
    return !Video.isExistPlayer();
  }

  /**
   * 是否启用视频脚本
   */
  static isEnable() {
    return Video.instance.config.enable;
  }
  static isDisable() {
    return !Video.instance.config.enable;
  }

  /**
   * 页面所有视频元组件
   */
  private getAllVideoElement(doc: Document = document): HTMLVideoElement[] {
    // 主页面 video 组件
    const videoArr = doc.querySelectorAll("video");

    // 获取子页面组件
    let allVideo = [...videoArr];
    const iframeArr = doc.querySelectorAll("iframe");
    for (const iframe of iframeArr) {
      if (!iframe.contentDocument) continue;
      allVideo = [
        ...allVideo,
        ...this.getAllVideoElement(iframe.contentDocument),
      ];
    }
    return allVideo;
  }

  /**
   * 获取当前主视频元组件
   */
  element(): HTMLVideoElement | null {
    // 播放中控件优先
    const allMedia = this.getAllVideoElement();
    for (const media of allMedia) {
      if (!media.paused) {
        this.config.lastElement = media;
        break;
      }
    }

    // 默认控件
    if (!this.config.lastElement) {
      this.config.lastElement = allMedia[0] ?? null;
    }
    return this.config.lastElement;
  }

  /**
   * 获取当前播放器组件
   */
  player(
    videoElement: HTMLVideoElement | null = this.element()
  ): HTMLElement | null {
    // 自定义规则
    const rule = this.rule();
    if (rule) return document.querySelector(rule.player);

    // 默认规则
    if (!videoElement) return null;

    return actionOfAllParent(videoElement, {
      parent: (el) =>
        el.clientHeight == videoElement.clientHeight &&
        el.clientWidth == videoElement.clientWidth,
    });
  }

  /**
   * 弹出视频提示
   */
  toast(text: string) {
    const player = this.player();
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
}
