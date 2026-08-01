import { Object3D, Vector2 } from "three";
import { type State } from "./state";

export type Item = {
    pos: Vector2;
    height: number;
    object?: Object3D;
}

const ITEM_MODELS = ["Item_cow", "Item_tree"];

export function addItem(state: State, x: number, y: number): void {
    const name = ITEM_MODELS[Math.floor(Math.random() * ITEM_MODELS.length)];
    const object = state.assets!.scene.getObjectByName(name)!.clone();
    state.scene.add(object);
    const i: Item = {
        pos: new Vector2(x, y),
        height: 0,
        object
    };
    state.items.push(i);
    object.position.set(x, 0, y);
    object.rotateY(Math.PI * 2 * Math.random());
}


export function removeItem(state:State, item:Item):void {
    state.scene.remove(item.object!);
    state.items = state.items.filter(i=>i!=item);
}