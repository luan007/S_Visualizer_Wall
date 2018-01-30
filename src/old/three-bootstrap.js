import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "./base.js";
import * as NEWTRY from "./fx/new-try.js";

var canvas = document.getElementById('maincanvas');

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
});

//0x211D1D
renderer.setClearColor(new THREE.Color(0x000000), 0);
renderer.setSize(Shared.W, Shared.H);
renderer.gammaInput = true;
renderer.gammaOutput = true;

var camera = new THREE.PerspectiveCamera(
    20,
    Shared.W / Shared.H,
    1,
    5000
);
camera.position.z = 1000;
Shared.camera = camera;

var root = new THREERenderable();
// var ambientLight = new THREE.AmbientLight(0xffff00);
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000, 1, 20000);
scene.add(root.group);


var light = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 10.1);
scene.add(light);

var light2 = new THREE.PointLight(new THREE.Color(1, 1, 1), 10, 100);
light2.translateY(-90);
light2.translateZ(-30);
scene.add(light2);

export function update(data) {
    camera.position.z += (500 - camera.position.z) * 0.02;
    root.update(data);
    renderer.render(scene, camera);
    NEWTRY.update();
}

onresize = function () {
    var w = window.innerWidth;
    var h = w / Shared.W * Shared.H;
    $(".suite-canvas").css({
        width: w,
        height: h
    });
    // canvas.style.width = w;
    // canvas.style.height = h;
    Shared.w = w;
    Shared.h = h;
}

setTimeout(()=>{
    onresize();
}, 300);


// ParticleDebug.Scene.addTo(root);
NEWTRY.Scene.addTo(root);