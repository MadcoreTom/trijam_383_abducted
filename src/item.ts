import { type Object3D, Vector2 } from "three";
import type { State } from "./state";

const ITEM_MODELS = ["Item_cow", "Item_cow2", "Item_tree","Item_tree2", "Hay"];

export class Item {
    private constructor(
        public readonly pos: Vector2,
        private _height: number,
        private readonly object: Object3D,
        public readonly liftTimeMult: number,
        public readonly canBump: boolean

    ) {

    }

    public static registerItem(state: State, x: number, y: number): Item {
        const name = ITEM_MODELS[Math.floor(Math.random() * ITEM_MODELS.length)];
        const object = state.assets!.scene.getObjectByName(name)!.clone();
        object.name = "ITEM" + state.items.length;
        state.scene.add(object);

        let liftTimeMult=1;
        let canBump = true;
        if (name === "Item_tree" || name === "Item_tree2"){
            liftTimeMult = 1.5;
            canBump = false;
        }

        const item = new Item(new Vector2(x, y), 0, object, liftTimeMult, canBump);

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

    public updatePos():void{
        this.object.position.setX(this.pos.x);
        this.object.position.setZ(this.pos.y);
    }
}