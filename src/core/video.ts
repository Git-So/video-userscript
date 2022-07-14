import rules from "../rules";
import { actionByAncestor } from "./func";
import { Rule } from "./typing";

export class Video {
  /**
   * 获取当前网站播放器规则
   */
  rule(): Rule | null {
    for (const rule of rules) {
      const rg = new RegExp(rule.match);
      if (location.href.search(rg) > -1) return rule;
    }
    return null;
  }

  /**
   * 默认播放元组件
   */
  defaultMedia(
    doc: Document = document,
    isAllowPaused = true
  ): HTMLVideoElement | null {
    // 直接 video 组件
    const videoArr = doc.querySelectorAll("video");
    let media = isAllowPaused ? videoArr[0] : null;
    for (const item of videoArr) {
      if (item.paused) continue;
      media = item;
    }

    // 获取 iframe 组件
    const iframeArr = doc.querySelectorAll("iframe");
    for (const iframe of iframeArr) {
      if (!iframe.contentDocument) continue;
      media = this.defaultMedia(iframe.contentDocument, false) ?? media;
    }

    return media;
  }

  /**
   * 默认播放器组件
   */
  defaultPlayer(media: HTMLVideoElement | null = null): HTMLElement | null {
    let player: HTMLElement | null = media ?? this.defaultMedia();
    if (!player) return null;

    return actionByAncestor(player, (parent) => {
      return (
        parent.clientHeight == player?.clientHeight &&
        parent.clientWidth == player?.clientWidth
      );
    });
  }

  /**
   * 播放器元组件
   */
  media(): HTMLVideoElement | null {
    const rule = this.rule();
    if (rule) {
      if (rule.media) return document.querySelector(rule.media);
      return document.querySelector(`${rule.player} video`);
    }
    return this.defaultMedia();
  }

  /**
   * 播放器组件
   */
  player(media: HTMLVideoElement | null = null): HTMLElement | null {
    const rule = this.rule();
    if (rule) return document.querySelector(rule.player);
    return this.defaultPlayer(media);
  }
}
