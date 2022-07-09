import { toast } from "./func";
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
      this.media!.volume = volume;
      this.toast(`${this.name}:${(this.media!.volume * 100) | 0}% `);
    });
  }
}
