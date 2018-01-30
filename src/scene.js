import { Shared } from "./env.js"; //setup
import { THREERenderTarget } from "./parts/three-particlebg.js";
import { Renderable, SceneControl } from "./base.js";
import * as GUI from "./parts/gui.js";

var Scene = new SceneControl();

var ThreeRenderTarget = new THREERenderTarget();
var DOMContainer = new GUI.FixedContainer();
DOMContainer.domElement.appendTo($(document.body));
var title = new GUI.Title();
DOMContainer.add(title);


Scene.managed.push(title);

window.scene = Scene;

var root = new Renderable([Scene, ThreeRenderTarget, DOMContainer]);
export function update() {
    root.update();
}
