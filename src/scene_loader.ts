import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { State } from "./state";
import { AmbientLight, DirectionalLight, FrontSide, HemisphereLight } from "three";

export async function loadScene(state: State): Promise<void> {

    const assets = await loadGltfPromise("scene.glb");

    // Update material to only render the front (annoying casting)
    assets.scene.traverse(ob => {
        if (ob.type === "Mesh" && "material" in ob) {
            (ob.material as any).side = FrontSide;
            (ob.material as any).needsUpdate = true;
        }
    })

    state.ufo.object = assets.scene.getObjectByName("ufo")!.clone();
    state.scene.add(state.ufo.object);

    state.player.object = assets.scene.getObjectByName("Man")!.clone();
    state.scene.add(state.player.object);

    const grass = assets.scene.getObjectByName("Grass")!;
    grass.scale.set(4,1,4);
    grass.position.set(0,0,40);
    state.scene.add(grass);

    console.log(state.ufo.object, state.player.object)

    const ambientLight = new AmbientLight(0xffffff, 1.5);
    state.scene.add(ambientLight);
    const skyLight = new HemisphereLight(0x4444ff, 0x000000, 6.0);
    
    state.scene.add(skyLight);

    state.assets = assets;
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