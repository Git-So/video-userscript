import { Rule } from "./core/typing";

/**
 * 规则列表
 * 规则越靠前优先级越高
 * player 可以打开网站自带的『全屏』，通过 `document.fullscreenElement` 获取
 */
const value: Rule[] = [
  {
    // 哔哩哔哩
    match: `^https?://www\.bilibili\.com/video/`,
    player: "#bilibili-player .bpx-player-container .bpx-player-video-area",
  },
];

export default value;
