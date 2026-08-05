import { type Object3D, Vector2 } from "three";
import type { State } from "./state";

const ITEM_MODELS = ["Item_cow", "Item_tree", "Hay"];

export class Item {
    private constructor(
        public readonly pos: Vector2,
        private _height: number,
        private readonly object: Object3D
    ) {

    }

    public static registerItem(state: State, x: number, y: number): Item {
        const name = ITEM_MODELS[Math.floor(Math.random() * ITEM_MODELS.length)];
        const object = state.assets!.scene.getObjectByName(name)!.clone();
        object.name = "ITEM" + state.items.length;
        state.scene.add(object);

        const item = new Item(new Vector2(x, y), 0, object);

        state.items.push(item);
        object.position.set(x, 0, y);
        object.rotateY(Math.PI * 2 * Math.random());
        return item;
    }

    public removeItem(state: State): void {
        state.scene.remove(this.object!);
        state.items = state.items.filter(i => i !== this);
    }

    public set height(height:number){
        this._height = height;
        this.object.position.setY(height);
    }

    public get height():number{
        return this._height;
    }
}