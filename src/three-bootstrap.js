import * as THREE from "three";
import { Renderable, THREERenderable, Shared } from "./base.js";

var canvas = document.getElementById('maincanvas');

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
});
renderer.setClearColor(new THREE.Color(0xfffff0), 1);
renderer.setSize(Shared.W, Shared.H);

var root = new THREERenderable();
var ambientLight = new THREE.AmbientLight(0x000000);
var scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0x000, 50, 80);
scene.add(root.group);
scene.add(ambientLight);

var camera = new THREE.PerspectiveCamera(
    50,
    Shared.W / Shared.H,
    0.1,
    1000
);

export function update(data) {
    root.update(data);
    renderer.render(scene, camera);
}

onresize = function () {
    var w = window.innerWidth;
    var h = w / Shared.W * Shared.H;
    canvas.style.width = w;
    canvas.style.height = h;
}

onresize();