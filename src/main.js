import * as Scene from "./scene.js";
import * as Env from "./env.js";

function update() {
    requestAnimationFrame(update);
    Env.update();
    Scene.update();
}

requestAnimationFrame(update);
