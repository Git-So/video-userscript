export interface Rule {
  match: string;
  player: string;
  media?: string;
}

export interface VideoConfig {
  enable: boolean;
  lastElement: HTMLVideoElement | null;
  isPirate: boolean;
}
export interface UserscriptConfig {
  video: VideoConfig;
}

export interface UserscriptWindow extends Window {
  UserscriptConfig?: UserscriptConfig;
}

export interface ActionGroupOfParent {
  parent: (el: HTMLElement) => boolean; // 返回值为false停止查找父级
  iframe?: (el: HTMLElement) => void;
  self?: (el: HTMLElement) => void;
}
