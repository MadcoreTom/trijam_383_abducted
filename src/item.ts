import { Object3D, Vector2 } from "three";
import { type State } from "./state";

export type Item = {
    pos: Vector2;
    height: number;
    object?: Object3D;
}

export function addItem(state: State, x: number, y: number): void {
    const object = state.assets!.scene.getObjectByName("Cube")!.clone();
    state.scene.add(object);
    const i: Item = {
        pos: new Vector2(x, y),
        height: 0,
        object
    };
    state.items.push(i);
    object.position.set(x, 0, y);
}
