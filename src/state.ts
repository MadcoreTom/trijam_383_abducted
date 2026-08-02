import { AudioListener, Camera, Object3D, PerspectiveCamera, Scene, SpotLight, Vector2 } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { addItem, Item } from "./item";
import { HEIGHT, WIDTH } from "./constants";

export type State = {
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
    listener?: AudioListener
}

export function initState(): State {
    const state: State = {
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
        ]
    };
    return state;
}
