import { topWindow } from "./func";
import { UserscriptConfig } from "./typing";

export class Config {
  private readonly initConfig: UserscriptConfig = {
    video: {
      enable: true,
      lastElement: null,
      isPirate: false,
    },
  };

  get window() {
    return topWindow();
  }

  get value() {
    if (!this.window.UserscriptConfig)
      this.window.UserscriptConfig = this.initConfig;
    return new Proxy(this.window.UserscriptConfig.video, {});
  }
}
