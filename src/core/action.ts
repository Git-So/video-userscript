import { actionByAncestor, between, toast } from "./func";
import { Video } from "./video";

export class Action {
  protected _name = "";
  get name() {
    return this._name;
  }

  protected video = new Video();

  protected _media: HTMLVideoElement | null = null;
  get media(): HTMLVideoElement | null {
    if (!this._media) this._media = this.video.media();
    return this._media;
  }

  protected _player: HTMLElement | null = null;
  get player(): HTMLElement | null {
    if (!this._player) this._player = this.video.player(this.media);
    return this._player;
  }

  protected safeAction(action: () => void, that: Action = this) {
    if (!this.media) return;
    action.apply(that);
  }

  protected toast(text: string) {
    toast(this.player, text);
  }
}

export class SwitchAction extends Action {
  get isEnable(): boolean {
    return false;
  }

  protected enableAction() {}
  enable() {
    this.safeAction(this.enableAction);
    this.toast(`${this.name}: 开`);
  }

  protected disableAction() {}
  disable() {
    this.safeAction(this.disableAction);
    this.toast(`${this.name}: 关`);
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
    return !!document.fullscreenElement;
  }

  protected enableAction(): void {
    this.player?.requestFullscreen();
  }

  protected disableAction(): void {
    document.exitFullscreen();
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
    return !!document.pictureInPictureElement;
  }

  protected enableAction(): void {
    this.media?.requestPictureInPicture();
  }

  protected disableAction(): void {
    if (!this.isEnable) return;
    document.exitPictureInPicture();
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
      this.toast(`${this.name}: ${value < 0 ? "" : "+"}${value}秒`);
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
      this.toast(`${this.name}:${(this.media!.volume * 100) | 0}% `);
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
      this.toast(`${this.name}: ${rate}x`);
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
    this.player?.classList.add(this.className);

    // 添加遮罩
    document.body.append(
      ((): HTMLElement => {
        const modal = document.createElement("DIV");
        modal.className = this.modalClassName;
        return modal;
      })()
    );

    // 添加父级 zIndex
    actionByAncestor(this.player!, (element) => {
      element.classList.add(this.parentClassName);
      return true;
    });
  }

  protected disableAction(): void {
    this.player?.classList.remove(this.className);

    // 清除遮罩
    document.querySelector(`.${this.modalClassName}`)?.remove();

    // 清除 zIndex
    document.querySelectorAll(`.${this.parentClassName}`).forEach((el) => {
      el.classList.remove(this.parentClassName);
    });
  }
}
