import { toast } from "./func";
import { Video } from "./video";

export class Action {
  name = "";

  protected safeAction(action: () => void, that: Action = this) {
    if (!Video.media) return;
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
    toast(`${this.name}: 开`);
  }

  protected disableAction() {}
  disable() {
    this.safeAction(this.disableAction);
    toast(`${this.name}: 关`);
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
  name = "视频全屏";

  get isEnable(): boolean {
    return !!document.fullscreenElement;
  }

  protected enableAction(): void {
    Video.player?.requestFullscreen();
  }

  protected disableAction(): void {
    document.exitFullscreen();
  }
}

/**
 * 视频播放暂停
 */
export class PlayState extends SwitchAction {
  name = "视频播放";

  get isEnable(): boolean {
    return !Video.media?.paused;
  }

  protected enableAction(): void {
    Video.media?.play();
  }

  protected disableAction(): void {
    Video.media?.pause();
  }
}

/**
 * 视频进度
 */
export class CurrentTime extends StepAction {
  name = "视频进度";
  step = 10;

  setValue(value: number, isStep = true) {
    this.safeAction(() => {
      const currentTime = isStep ? Video.media!.currentTime + value : value;
      Video.media!.currentTime = currentTime;
      toast(`${this.name}: ${value < 0 ? "" : "+"}${value}秒`);
    });
  }
}

/**
 * 音量调整
 */
export class Volume extends StepAction {
  name = "音量";
  step = 0.1;

  setValue(value: number, isStep = true) {
    this.safeAction(() => {
      const volume = isStep ? Video.media!.volume + value : value;
      Video.media!.volume = volume;
      toast(`${this.name}:${(Video.media!.volume * 100) | 0}% `);
    });
  }
}
