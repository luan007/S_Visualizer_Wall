import { Shared } from "./env.js"; //setup
import { THREERenderTarget } from "./parts/three-particlebg.js";
import { Renderable } from "./base.js";
import * as GUI from "./parts/gui.js";


var ThreeRenderTarget = new THREERenderTarget();
var DOMContainer = new GUI.FixedContainer();
    DOMContainer.domElement.appendTo($(document.body));
    var title = new GUI.Title();
    DOMContainer.add(title);


var root = new Renderable([ThreeRenderTarget, DOMContainer]);
export function update() {
    root.update();
}
