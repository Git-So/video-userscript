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
  defaultMedia(): HTMLVideoElement | null {
    const items = document.querySelectorAll("video");
    let media = items[0] ?? null;
    for (const item of items) {
      if (!item.paused) break;
      media = item;
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
