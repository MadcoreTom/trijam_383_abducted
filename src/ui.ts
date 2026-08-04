import { HEIGHT, WIDTH } from "./constants";
import { State } from "./state";

function applyStyle(elem: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    let name: keyof CSSStyleDeclaration
    for (name in style) {
        elem.style[name] = style[name]!;
    };
}

export function initUi(state: State, gameElement: HTMLElement) {

    const root = document.getElementById("game-root")!;
    root.innerHTML = "";
    root.appendChild(gameElement);


    const popup = document.createElement("div") as HTMLDivElement;
    applyStyle(popup, {
        background: "black",
        border: "2px solid #1f1",
        padding: "10px",
        zIndex: "100",
        position: "absolute",
        top: "100px",
        left: (WIDTH * 1 / 6) + "px",
        width: (WIDTH * 2 / 3) + "px",
        textAlign: "center"
    });
    state.popup.visible.subscribe(v => {
        popup.style.display = v ? "block" : "none"
    });
    state.popup.content.subscribe(v => {
        popup.innerHTML = v;
    });
    root.appendChild(popup);


    const timer = document.createElement("div") as HTMLDivElement;
    applyStyle(timer, {
        background: "black",
        border: "2px solid #1f1",
        padding: "10px",
        width: "80px",
        textAlign: "center",
        position: "relative",
        top: `${-HEIGHT}px`
    });
    state.timer.subscribe(v => timer.innerText = `${v}`);
    root.appendChild(timer);
}
