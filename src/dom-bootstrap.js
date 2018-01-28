import { Renderable, DOMRenderable, Shared, BuildRenderable } from "./base.js";
import * as DOMFx from "./fx/dom.js";

var root = new DOMFx.FixedContainer();
root.domElement.appendTo($(document.body));
// root.add(new DOMFx.WeiboFloaterManager());

export function update() {
    root.update();
}