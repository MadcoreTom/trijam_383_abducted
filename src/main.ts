import { PCFShadowMap, Vector2, WebGLRenderer } from "three";
import { loadScene } from "./scene_loader";
import { initState } from "./state";
import { addItem, removeItem } from "./item";

console.table(["Hello World", new Date()]);


const state = initState();
const placeholder = document.getElementById("debug") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ antialias: true });


function tick(time: number) {

    // update

    const aim = state.player.pos.clone().sub(state.ufo.pos).normalize();
    state.ufo.direction.addScaledVector(aim, 0.04).normalize(); // TODO make this line framerate independent

    // move
    const PLAYER_SPEED = 0.2;
    state.ufo.pos.addScaledVector(state.ufo.direction, PLAYER_SPEED / 1.1);

    if (state.player.height == 0) {
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
    }

    const ABDUCTION_RADIUS = 2.5;
    const PLAYER_ABDUCTION_SPEED = 0.2;
    const ITEM_ABDUCTION_SPEED = 0.4;
    const ABDUCTION_HEIGHT = 5;
    if (state.ufo.pos.distanceToSquared(state.player.pos) < ABDUCTION_RADIUS * ABDUCTION_RADIUS) {
        state.player.height += PLAYER_ABDUCTION_SPEED;
    } else if (state.player.height > 0) {
        state.player.height -= PLAYER_ABDUCTION_SPEED;
        state.player.height = Math.max(0, state.player.height);
    }

    state.items.forEach(item => {
        if (state.ufo.pos.distanceToSquared(item.pos) < ABDUCTION_RADIUS * ABDUCTION_RADIUS) {
            item.height += ITEM_ABDUCTION_SPEED;
            item.object && (item.object.position.setY(item.height));
            if(item.height > ABDUCTION_HEIGHT){
                removeItem(state,item);
            }
        } else if (item.height > 0) {
            item.height -= PLAYER_SPEED;
            item.height = Math.max(0, item.height);
            item.object && (item.object.position.setY(item.height));
        }
    });

    // replenish items
    if(state.assets && state.items.length < 30 && Math.random()  < 0.1){ // TODO rate is framerate dependent
        addItem(state, Math.random()*40,Math.random()*40);
    }

    // update scene
    if (state.ufo.object) {
        state.ufo.object.position.set(state.ufo.pos.x, 5, state.ufo.pos.y);
    }
    if (state.player.object) {
        state.player.object.position.set(state.player.pos.x, state.player.height, state.player.pos.y)
    }
    
    // state.camera.position.set(state.player.pos.x, 600, 500);
    // state.camera.lookAt(state.player.pos.x, 0, (200 * 2 + state.player.pos.y) / 3);
    state.camera.position.set(20, 50, 100);
    state.camera.lookAt(20, 0, 20);

    renderer.render(state.scene, state.camera);

    window.requestAnimationFrame(tick);
}
window.requestAnimationFrame(tick);

const KEYS: { [key: string]: boolean } = {};
function onKey(down: boolean): (evt: KeyboardEvent) => unknown {
    return evt => {
        KEYS[evt.key] = down;
        if(state.listener && state.listener.context.state === "suspended"){
            state.listener.context.resume();
        }
    }
}

window.addEventListener("keydown", onKey(true));
window.addEventListener("keyup", onKey(false));

async function initThreeJs() {
    renderer.setSize(800, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor("#000000");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap; //  Makes shadow edges smoother
    await loadScene(state);

    placeholder.parentElement!.replaceChild(renderer.domElement, placeholder);
}

initThreeJs();