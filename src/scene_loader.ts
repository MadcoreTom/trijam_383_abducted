import { type GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import type { State } from "./state";
import { AmbientLight, Audio, AudioListener, AudioLoader, DirectionalLight, FrontSide, HemisphereLight, type MeshStandardMaterial, SpotLight } from "three";

export async function loadScene(state: State): Promise<void> {

    const assets = await loadGltfPromise("scene.glb");

    // Update material to only render the front (annoying casting)
    assets.scene.traverse(ob => {
        if (ob.type === "Mesh" && "material" in ob) {
            const mat = ob.material as MeshStandardMaterial;
            mat.side = FrontSide;
            mat.needsUpdate = true;
            if (mat.isMeshStandardMaterial) {
                mat.roughness = 0.8;
                mat.metalness = 0.0;
            }
            console.log(mat)

            ob.castShadow = true;
            ob.receiveShadow = true;
        }
    })

    state.ufo.object = assets.scene.getObjectByName("ufo")!.clone();
    state.scene.add(state.ufo.object);

    state.player.object = assets.scene.getObjectByName("Man")!.clone();
    state.scene.add(state.player.object);

    const grass = assets.scene.getObjectByName("Grass")!;
    grass.scale.set(4, 1, 4);
    grass.position.set(0, 0, 40);
    state.scene.add(grass);

    console.log(state.ufo.object, state.player.object)

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    state.scene.add(ambientLight);

    const skyLight = new HemisphereLight(0xaaccff, 0x000000, 8.0);
    state.scene.add(skyLight);
    const LIGHT_BOUNDS = 40;
    const moonLight = new DirectionalLight(0xffffff, 8);
    moonLight.position.set(20, 10, 20);
    moonLight.target.position.set(20, 0, 20);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    Object.assign(moonLight.shadow.camera, {
        near: 0.5,
        far: 20,
        left: -LIGHT_BOUNDS,
        right: LIGHT_BOUNDS,
        top: LIGHT_BOUNDS,
        bottom: -LIGHT_BOUNDS,
    });
    moonLight.shadow.bias = -0.01;
    moonLight.shadow.intensity = 0.75;
    state.scene.add(moonLight);
    state.scene.add(moonLight.target);

    const spot = new SpotLight(0x00ff00, 10, 0, Math.PI * 0.1, 0.2, 0);
    spot.position.set(20, 10, 20);
    spot.target.position.set(20, 0, 20);
    state.scene.add(spot);
    state.scene.add(spot.target);
    state.ufo.spotlight = spot;

    state.assets = assets;

    /// music

    const listener = new AudioListener();
    state.camera.add(listener);
    // create a global audio source
    const sound = new Audio(listener);
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load('music.ogg', (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });

    const bonk = new Audio(listener);
    // load a sound and set it as the Audio object's buffer
    audioLoader.load('bonk.wav', (buffer) => {
        bonk.setBuffer(buffer);
        bonk.setLoop(false);
        bonk.setVolume(0.75);
    });
    state.bonk = bonk;


    const abduct = new Audio(listener);
    // load a sound and set it as the Audio object's buffer
    audioLoader.load('abduct.wav', (buffer) => {
        abduct.setBuffer(buffer);
        abduct.setLoop(false);
        abduct.setVolume(0.75);
    });
    state.abduct = abduct;

    state.listener = listener;

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