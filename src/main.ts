import { PCFShadowMap, Vector2, WebGLRenderer } from "three";
import { loadScene } from "./scene_loader";
import { initState, resetSate } from "./state";
import { addItem, removeItem } from "./item";
import { HEIGHT, WIDTH } from "./constants";

console.table(["Hello World", new Date()]);

const state = initState();
const placeholder = document.getElementById("debug") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ antialias: true });

let lastTime = 0;

function tick(time: number) {
    const delta = Math.min(100,time - lastTime);
    lastTime = time;

    const ABDUCTION_RADIUS = 2.5;
    const PLAYER_ABDUCTION_SPEED = 0.2;
    const ITEM_ABDUCTION_SPEED = 0.4;
    const ABDUCTION_HEIGHT = 7;
    // update
    if (state.mode === "PLAYING") {
        state.time += delta;

        // 0.04 to (0.04 + 0.1) in 45 seconds
        const turningPower = 0.04 + 0.1 * Math.pow(0.5,state.time / (1000 * 45));
        const aim = state.player.pos.clone().sub(state.ufo.pos).normalize();
        state.ufo.direction.addScaledVector(aim,turningPower).normalize(); // TODO make this line framerate independent

        // move
        const PLAYER_SPEED = 0.2;

        let dir: Vector2 = new Vector2(0, 0);

        if (state.player.height == 0) {
            if (KEYS["ArrowUp"] || KEYS["w"]) {
                dir.setY(-1);
            }
            if (KEYS["ArrowDown"] || KEYS["s"]) {
                dir.setY(1);
            }
            if (KEYS["ArrowLeft"] || KEYS["a"]) {
                dir.setX(-1);
            }
            if (KEYS["ArrowRight"] || KEYS["d"]) {
                dir.setX(1);
            }
            if (dir.lengthSq() > 0) {
                state.player.pos.add(dir?.normalize().multiplyScalar(PLAYER_SPEED));
                //clamp position to 40x40
                state.player.pos.setX(Math.max(0,Math.min(40, state.player.pos.x)));
                state.player.pos.setY(Math.max(0,Math.min(40, state.player.pos.y)));
            }
        }

        let abductingPlayer = false;
        if (state.ufo.pos.distanceToSquared(state.player.pos) < ABDUCTION_RADIUS * ABDUCTION_RADIUS) {
            state.player.height += PLAYER_ABDUCTION_SPEED;
            abductingPlayer = true;
            if (state.player.height > ABDUCTION_HEIGHT) {
                  if(state.abduct){
                        if(state.abduct.isPlaying){
                            state.abduct.stop();
                        }
                        state.abduct.play();
                    }
                state.mode = "GAMEOVER";
                state.topTime = Math.max(state.topTime, state.time);
                overlay.style.display = "block";
                overlay.innerHTML = `<p><b>You got abducted</b> by the aliens! You Lose!</p>
    <p>You survived <u>${Math.floor(state.time / 1000)} seconds</u>. Your best score is ${Math.floor(state.topTime / 1000)} seconds.<br>Try and get a higher score</p>
<p>Controls: WASD or Arrow keys</p>
<p>Made for the TriJam game jam #383</p>
<button onclick='play()'>Play</button>`;
state.time = 0;
            }
        } else if (state.player.height > 0) {
            state.player.height -= PLAYER_ABDUCTION_SPEED;
            state.player.height = Math.max(0, state.player.height);
        }

        const ufoSpeedMuiltiplier = 0.95 + 0.18 * Math.pow(0.5,state.time / (1000 * 10));
        state.slowtimer = Math.max(0, state.slowtimer-delta);

        state.ufo.pos.addScaledVector(state.ufo.direction, PLAYER_SPEED / ufoSpeedMuiltiplier * (abductingPlayer ? 0.5 : 1) * (state.slowtimer > 0 ? 0.8 : 1));

        state.items.forEach(item => {
            if (state.ufo.pos.distanceToSquared(item.pos) < ABDUCTION_RADIUS * ABDUCTION_RADIUS) {
                item.height += ITEM_ABDUCTION_SPEED;
                item.object && (item.object.position.setY(item.height));
                if (item.height > ABDUCTION_HEIGHT) {
                    state.slowtimer += 500; // add the slow effect for 500ms
                    if(state.bonk){
                        if(state.bonk.isPlaying){
                            state.bonk.stop();
                        }
                        state.bonk.play();
                    }
                    removeItem(state, item);
                }
            } else if (item.height > 0) {
                item.height -= PLAYER_SPEED;
                item.height = Math.max(0, item.height);
                item.object && (item.object.position.setY(item.height));
            }
        });

        // replenish items
        if (state.assets && state.items.length < 30 && Math.random() < 0.1) { // TODO rate is framerate dependent
            addItem(state, Math.random() * 40, Math.random() * 40);
        }
    } else {
         if (KEYS["Enter"] || KEYS["Space"]) {
              (window as any).play();
            }
    }

    // update scene
    if (state.ufo.object) {
        state.ufo.object.position.set(state.ufo.pos.x, ABDUCTION_HEIGHT, state.ufo.pos.y);
    }
    if (state.ufo.spotlight) {
        state.ufo.spotlight.position.set(state.ufo.pos.x, ABDUCTION_HEIGHT, state.ufo.pos.y);
        state.ufo.spotlight.target.position.set(state.ufo.pos.x, 0, state.ufo.pos.y);
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
        if (state.listener && state.listener.context.state === "suspended") {
            state.listener.context.resume();
        }
    }
}

window.addEventListener("keydown", onKey(true));
window.addEventListener("keyup", onKey(false));

const overlay = document.createElement("div") as HTMLDivElement;
overlay.style.background = "black";
overlay.style.border = "2px solid #1f1";
overlay.style.padding = "10px"
overlay.style.margin = (HEIGHT * -2/3) + "px auto"
overlay.style.zIndex = "100";
overlay.style.position = "relative"
overlay.style.width = (WIDTH *2/3) + "px";
overlay.style.textAlign = "center";
overlay.innerHTML = `<p><u>You were the chosen one</u> by the aliens, and now you must avoid being abducted by their UFO at all costs</p>
<p>Controls: WASD or Arrow keys</p>
<p>Made for the TriJam game jam #383</p>
<button onclick='play()'>Play</button>`;

async function initThreeJs() {
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor("#000000");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap; //  Makes shadow edges smoother
    await loadScene(state);

    placeholder.parentElement!.replaceChild(renderer.domElement, placeholder);



    renderer.domElement.parentElement!.appendChild(overlay);
}

// eww, gross
(window as any).play = () => {
    state.mode = "PLAYING";
    overlay.style.display = "none";
    resetSate(state);
}

initThreeJs();