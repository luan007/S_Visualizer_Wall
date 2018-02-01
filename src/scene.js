import { Shared } from "./env.js"; //setup
import * as THREE_TARGET from "./parts/three-particlebg.js";
import { Renderable, SceneControl } from "./base.js";
import * as GUI from "./parts/gui.js";


//THREE
var ThreeRenderTarget = new THREE_TARGET.THREERenderTarget();
var ParticleBG = new THREE_TARGET.ParticleBackground();
ThreeRenderTarget.add(ParticleBG);
window.ParticleBG = ParticleBG;
//DOM
var DOMContainer = new GUI.FixedContainer();
DOMContainer.domElement.appendTo($(document.body));
var title = new GUI.Title();
DOMContainer.add(title);

var numbers = new GUI.Numbers();
DOMContainer.add(numbers);

var bgCanvas = new GUI.AvatarWall();

//Logic
var Scene = new SceneControl();
Scene.managed.push(title);
Scene.managed.push(numbers);
Scene.managed.push(ParticleBG);
Scene.managed.push(bgCanvas);

window.scene = Scene;

var root = new Renderable([Scene, ThreeRenderTarget, DOMContainer, bgCanvas]);
export function update() {
    root.update();
}
