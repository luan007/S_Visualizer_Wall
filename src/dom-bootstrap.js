import { Renderable, Shared, BuildRenderable } from "./base.js";
import * as DOMFx from "./fx/dom.js";


var root = new Renderable();


export function update() {
    root.update();
}