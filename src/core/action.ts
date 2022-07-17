import {
  actionOfAllParent,
  actionOfAllSubWindow,
  between,
  topWindow,
} from "./func";
import { UserscriptWindow } from "./typing";
import { Video } from "./video";

export class Action {
  protected _name = "";
  get name() {
    return this._name;
  }

  get video(): Video {
    return Video.instance;
  }

  get media(): HTMLVideoElement | null {
    return this.video.element();
  }

  get player(): HTMLElement | null {
    return this.video.player();
  }

  get window(): UserscriptWindow {
    return topWindow();
  }

  get document(): Document {
    return this.window.document;
  }

  protected safeAction(action: () => void, that: Action = this) {
    if (!this.media) return;
    action.apply(that);
  }
}

export class SwitchAction extends Action {
  get isEnable(): boolean {
    return false;
  }

  protected enableAction() {}
  enable() {
    this.safeAction(this.enableAction);
    this.video.toast(`${this.name}: 开`);
  }

  protected disableAction() {}
  disable() {
    this.safeAction(this.disableAction);
    this.video.toast(`${this.name}: 关`);
  }

  toggle() {
    this.isEnable ? this.disable() : this.enable();
  }
}

export class StepAction extends Action {
  step = 1;

  setValue(_value: number, _isStep = true) {}

  add(step = this.step) {
    this.setValue(+step);
  }

  sub(step = this.step) {
    this.setValue(-step);
  }
}

/**
 * 视频全屏
 */
export class Fullscreen extends SwitchAction {
  protected _name = "视频全屏";

  get isEnable(): boolean {
    return !!this.document.fullscreenElement;
  }

  protected enableAction(): void {
    this.player?.requestFullscreen();
  }

  protected disableAction(): void {
    this.document.exitFullscreen();
  }
}

/**
 * 视频播放暂停
 */
export class PlayState extends SwitchAction {
  protected _name = "视频播放";

  get isEnable(): boolean {
    return !this.media?.paused;
  }

  protected enableAction(): void {
    this.media?.play();
  }

  protected disableAction(): void {
    this.media?.pause();
  }
}

/**
 * 画中画
 * 不兼容火狐
 */
export class PictureInPicture extends SwitchAction {
  protected _name = "画中画";

  get isEnable(): boolean {
    return !!this.media?.ownerDocument.pictureInPictureElement;
  }

  protected enableAction(): void {
    this.media?.requestPictureInPicture();
  }

  protected disableAction(): void {
    if (!this.isEnable) return;
    this.media?.ownerDocument.exitPictureInPicture();
  }
}

/**
 * 视频进度
 */
export class CurrentTime extends StepAction {
  protected _name = "视频进度";
  step = 10;

  setValue(value: number, isStep = true) {
    this.safeAction(() => {
      const currentTime = isStep ? this.media!.currentTime + value : value;
      this.media!.currentTime = currentTime;
      this.video.toast(`${this.name}: ${value < 0 ? "" : "+"}${value}秒`);
    });
  }
}

/**
 * 音量调整
 */
export class Volume extends StepAction {
  protected _name = "音量";
  step = 0.1;

  setValue(value: number, isStep = true) {
    this.safeAction(() => {
      const volume = isStep ? this.media!.volume + value : value;
      this.media!.volume = between(volume, 0, 1);
      this.video.toast(`${this.name}:${(this.media!.volume * 100) | 0}% `);
    });
  }
}

/**
 * 倍数播放
 */
export class PlaybackRate extends StepAction {
  protected _name = "倍数播放";
  step = 1;

  private playbackRate = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 5];
  private defaultIdx = 3;

  private get currIdx(): number {
    if (!this.media) return this.defaultIdx;

    const idx = this.playbackRate.indexOf(this.media.playbackRate);
    return idx < 0 ? this.defaultIdx : idx;
  }

  setValue(value: number, isStep = true) {
    this.safeAction(() => {
      value = isStep ? this.currIdx + value : value;
      const idx = between(value, 0, this.playbackRate.length - 1);
      const rate = this.playbackRate[idx];
      this.media!.playbackRate = rate;
      this.video.toast(`${this.name}: ${rate}x`);
    });
  }

  restart() {
    this.setValue(this.defaultIdx, false);
  }
}

/**
 * 影院模式/关灯模式
 */
export class MovieMode extends SwitchAction {
  protected _name = "影院模式";

  private className = "sooo--video-movie-mode";
  private parentClassName = "sooo--video-movie-mode-parent";
  private modalClassName = "sooo--video-movie-mode-modal";

  get isEnable(): boolean {
    return !!this.player?.classList.contains(this.className);
  }

  protected enableAction(): void {
    const action = (el: HTMLElement) => {
      el.classList.add(this.className);

      // 添加遮罩
      el.ownerDocument.body.append(
        ((): HTMLElement => {
          const modal = el.ownerDocument.createElement("DIV");
          modal.className = this.modalClassName;
          return modal;
        })()
      );
    };

    // 添加父级 zIndex
    actionOfAllParent(this.player!, {
      parent: (el) => {
        el.classList.add(this.parentClassName);
        return true;
      },
      iframe: action,
      self: action,
    });
  }

  protected disableAction(): void {
    this.player?.classList.remove(this.className);

    actionOfAllSubWindow((win) => {
      // 清除遮罩
      win.document.querySelector(`.${this.modalClassName}`)?.remove();

      // 清除 zIndex
      win.document
        .querySelectorAll(`.${this.parentClassName}`)
        .forEach((el) => {
          el.classList.remove(this.parentClassName);
        });
    });
  }
}

/**
 * 视频镜像
 */
export class Mirror extends SwitchAction {
  protected _name = "视频镜像";

  private className = "sooo--video-mirror";

  get isEnable(): boolean {
    return !!this.player?.classList.contains(this.className);
  }

  protected enableAction(): void {
    this.player?.classList.add(this.className);
  }

  protected disableAction(): void {
    this.player?.classList.remove(this.className);
  }
}

/**
 * 循环播放
 */
export class Loop extends SwitchAction {
  protected _name = "循环播放";

  get isEnable(): boolean {
    return !!this.media?.loop;
  }

  protected enableAction(): void {
    this.media!.loop = true;
  }

  protected disableAction(): void {
    this.media!.loop = false;
  }
}

/**
 * 视频静音
 */
export class Muted extends SwitchAction {
  protected _name = "视频静音";

  get isEnable(): boolean {
    return !!this.media?.muted;
  }

  protected enableAction(): void {
    this.media!.muted = true;
  }

  protected disableAction(): void {
    this.media!.muted = false;
  }
}

/**
 * 视频解析
 */
export class Pirate extends Action {
  protected _name = "视频解析";

  private ruleArr = [
    "https://z1.m1907.cn/?jx=",
    "https://jsap.attakids.com/?url=",
    "https://jx.bozrc.com:4433/player/?url=",
    "https://okjx.cc/?url=",
    "https://jx.blbo.cc:4433/?url=",
    "https://www.yemu.xyz/?url=",
    "https://jx.aidouer.net/?url=",
    "https://jx.xmflv.com/?url=",
    "https://jx.m3u8.tv/jiexi/?url=",
  ];

  open(idx: number) {
    new PlayState().disable();
    GM_openInTab(
      this.ruleArr[between(idx, 0, this.ruleArr.length - 1)] + location.href
    );
  }
}

/**
 * 视频脚本开关
 */
export class ScriptState extends SwitchAction {
  protected _name = "视频脚本";

  get isEnable(): boolean {
    return this.video.config.enable;
  }

  protected enableAction(): void {
    this.video.config.enable = true;
  }

  protected disableAction(): void {
    this.video.config.enable = false;
  }
}
