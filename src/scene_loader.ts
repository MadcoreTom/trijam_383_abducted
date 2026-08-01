import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { State } from "./main";

export async function loadScene(state: State): Promise<void> {

    const assets = await loadGltfPromise("scene.glb");

    const ufo = assets.scene.getObjectByName("ufo")!.clone();
    state.scene.add(ufo);
    state.ufo.object = ufo;

    
    const player = state.scene.add(assets.scene.getObjectByName("Cube")!.clone());
    state.player.object = player;
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