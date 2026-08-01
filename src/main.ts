import { Camera, Object3D, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { loadScene } from "./scene_loader";

console.table(["Hello World", new Date()]);

export type State = {
    player: {
        pos: Vector2,
        object?: Object3D
    },
    ufo: {
        pos: Vector2,
        direction: Vector2,
        object?: Object3D
    },
    scene: Scene,
    camera: Camera
}
const state: State = {
    player: {
        pos: new Vector2(5, 7)
    },
    ufo: {
        pos: new Vector2(20, 20),
        direction: new Vector2(1, 0)
    },
    scene: new Scene(),
    camera: new PerspectiveCamera(36, 1 / 1, 1, 1500)
}


const debugCanvas = document.getElementById("debug") as HTMLCanvasElement;
const ctx = debugCanvas.getContext("2d") as CanvasRenderingContext2D;
const renderer = new WebGLRenderer({ antialias: true });


function tick(time: number) {

    // update

    const aim = state.player.pos.clone().sub(state.ufo.pos).normalize();
    state.ufo.direction.addScaledVector(aim, 0.03).normalize(); // TODO make this line framerate independent

    // move
const PLAYER_SPEED = 0.2;
    state.ufo.pos.addScaledVector(state.ufo.direction, PLAYER_SPEED / 1.1);

    if (KEYS["ArrowUp"]) {
        state.player.pos.add(new Vector2(0, -PLAYER_SPEED));
    }
    if (KEYS["ArrowDown"]) {
        state.player.pos.add(new Vector2(0, PLAYER_SPEED));
    }
    if (KEYS["ArrowLeft"]) {
        state.player.pos.add(new Vector2(-PLAYER_SPEED, 0));
    }
    if (KEYS["ArrowRight"]) {
        state.player.pos.add(new Vector2(PLAYER_SPEED, 0));
    }

    // update scene
    if (state.ufo.object) {
        state.ufo.object.position.set(state.ufo.pos.x, 10, state.ufo.pos.y);
    }
    if (state.player.object) {
        state.player.object.position.set(state.player.pos.x, 0, state.player.pos.y)
    }
    // state.camera.position.set(state.player.pos.x, 600, 500);
    // state.camera.lookAt(state.player.pos.x, 0, (200 * 2 + state.player.pos.y) / 3);
    state.camera.position.set(0, 50, 100);
    state.camera.lookAt(0, 0, 20);

    // render
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "limegreen";
    ctx.beginPath();
    ctx.arc(state.ufo.pos.x*10, state.ufo.pos.y*10, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(state.ufo.pos.x*10, state.ufo.pos.y*10);
    ctx.lineTo(state.ufo.pos.x*10 + state.ufo.direction.x * 20, state.ufo.pos.y*10 + state.ufo.direction.y * 20);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(state.player.pos.x*10, state.player.pos.y*10, 10, 0, 2 * Math.PI);
    ctx.fill();

    renderer.render(state.scene, state.camera);

    window.requestAnimationFrame(tick);
}
window.requestAnimationFrame(tick);

const KEYS: { [key: string]: boolean } = {};
function onKey(down: boolean): (evt: KeyboardEvent) => unknown {
    return evt => {
        KEYS[evt.key] = down;
    }
}

window.addEventListener("keydown", onKey(true));
window.addEventListener("keyup", onKey(false));

function initThreeJs() {
    renderer.setSize(800, 800);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor("#ff00ff");
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = PCFShadowMap; //  Makes shadow edges smoother
    loadScene(state);
    debugCanvas.parentElement!.appendChild(renderer.domElement);
}

initThreeJs();