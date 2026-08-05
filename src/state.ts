import { type Audio, type AudioListener, type Camera, type Object3D, PerspectiveCamera, Scene, type SpotLight, Vector2 } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type { Item } from "./item";
import { HEIGHT, INTRO_TEXT, WIDTH } from "./constants";
import { OnChange } from "./util/onchange";

export type State = {
    mode: "PLAYING" | "GAMEOVER" | "INTRO",
    player: {
        pos: Vector2,
        object?: Object3D,
        height: number
    },
    ufo: {
        pos: Vector2,
        direction: Vector2,
        object?: Object3D,
        spotlight?: SpotLight
    },
    items: Item[],
    scene: Scene,
    camera: Camera,
    assets?: GLTF,
    listener?: AudioListener,
    time:number,
    topTime:number;
    slowtimer: number;
    bonk?: Audio,
    abduct?: Audio,
    popup: {
        visible: OnChange<boolean>;
        content: OnChange<string>;
    },
    timer: OnChange<number>
}

export function initState(): State {
    const state: State = {
        mode: "INTRO",
        player: {
            pos: new Vector2(5, 7),
            height:0
        },
        ufo: {
            pos: new Vector2(20, 20),
            direction: new Vector2(1, 0)
        },
        scene: new Scene(),
        camera: new PerspectiveCamera(18, WIDTH / HEIGHT, 1, 1500),
        items: [
        ],
        time: 0,
        topTime: 0,
        slowtimer:0,
        popup: {
            visible: new OnChange(true),
            content: new OnChange(INTRO_TEXT)
        },
        timer: new OnChange(0)
    };
    return state;
}

export function resetSate(state: State) {
    const toRemove: Object3D[] = [];
    state.scene.traverse(ob => {
        if (ob?.name.startsWith("ITEM")) {
            toRemove.push(ob);
        };
    });
    toRemove.forEach(ob => ob.removeFromParent());
    state.items = [];
    state.player.pos = new Vector2(5, 7);
    state.player.height = 0;
    state.ufo.pos = new Vector2(20, 20);
}