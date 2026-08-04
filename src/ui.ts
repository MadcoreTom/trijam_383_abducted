import { HEIGHT, WIDTH } from "./constants";
import { State } from "./state";

export function initUi(state: State, element: HTMLElement) {

    const overlay = document.createElement("div") as HTMLDivElement;
    overlay.style.background = "black";
    overlay.style.border = "2px solid #1f1";
    overlay.style.padding = "10px"
    overlay.style.margin = (HEIGHT * -2 / 3) + "px auto"
    overlay.style.zIndex = "100";
    overlay.style.position = "relative"
    overlay.style.width = (WIDTH * 2 / 3) + "px";
    overlay.style.textAlign = "center";


    state.popup.visible.subscribe(v => {
        overlay.style.display = v ? "block" : "none"
    });


    state.popup.content.subscribe(v => {
        overlay.innerHTML = v;
    });

    element.appendChild(overlay);
}
