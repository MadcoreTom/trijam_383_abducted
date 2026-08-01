import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { State } from "./main";
import { AmbientLight, BackSide, FrontSide } from "three";

export async function loadScene(state: State): Promise<void> {

    const assets = await loadGltfPromise("scene.glb");

    // Update material to only render the front
    assets.scene.traverse(ob => {
        if (ob.type === "Mesh" && "material" in ob) {
            ob.material.side = FrontSide;
            ob.material.needsUpdate = true;
            console.log("MAT", ob.material)
        }
    })

    state.ufo.object = assets.scene.getObjectByName("ufo")!.clone();
    state.scene.add(state.ufo.object);

    state.player.object = assets.scene.getObjectByName("Cube")!.clone();
    state.scene.add(state.player.object);

    console.log(state.ufo.object, state.player.object)

    const ambientLight = new AmbientLight(0xffffff, 2.0);
    state.scene.add(ambientLight);
}


async function loadGltfPromise(path: string): Promise<GLTF> {
    return new Promise((resolve, rej) => {
        const loader = new GLTFLoader();
        loader.load(path,
            (gltf) => {
                resolve(gltf);
            },
            undefined,
            err => rej(err)
        );
    });
}