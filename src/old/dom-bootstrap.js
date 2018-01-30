import { Renderable, DOMRenderable, Shared, BuildRenderable } from "./base.js";
import * as DOMFx from "./fx/dom.js";
import * as GUI from "./parts/gui.js";

var root = new DOMFx.FixedContainer();
root.domElement.appendTo($(document.body));
// root.add(new DOMFx.WeiboFloaterManager());


var title = new GUI.Title();
window.title = title;
root.add(title);

export function update() {
    root.update();
}