import * as Action from "./core/action";

document.addEventListener("keydown", (e) => {
  switch (true) {
    case e.code == "Enter":
      new Action.Fullscreen().toggle();
      break;
  }
});

export {};
