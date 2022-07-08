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
