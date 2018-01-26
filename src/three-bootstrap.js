import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "./base.js";
import * as ParticleDebug from "./fx/particle-debug.js";

var canvas = document.getElementById('maincanvas');

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    // alpha: true,
    canvas: canvas
});

renderer.setClearColor(new THREE.Color(0x211D1D), 1);
renderer.setSize(Shared.W, Shared.H);
renderer.gammaInput = true;
renderer.gammaOutput = true;


var camera = new THREE.PerspectiveCamera(
    20,
    Shared.W / Shared.H,
    0.1,
    5000
);
camera.position.z = 500;
Shared.camera = camera;

var root = new THREERenderable();
// var ambientLight = new THREE.AmbientLight(0xffff00);
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000, 1, 1000);
scene.add(root.group);


var light = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 10.1);
scene.add(light);

var light2 = new THREE.PointLight(new THREE.Color(1, 1, 1), 10, 100);
light2.translateY(-90);
light2.translateZ(-30);
scene.add(light2);


// scene.add(ambientLight);

// root.build((group) => {
//     var geometry = new THREE.TetrahedronGeometry(5, 0);
//     var material = new THREE.MeshNormalMaterial();
//     var mesh = new THREE.Mesh(geometry, material);
//     group.add(mesh);
//     return (o) => {
//         mesh.rotateX(0.01);
//         mesh.rotateY(0.02);
//     }
// })

ParticleDebug.Scene.addTo(root);

export function update(data) {
    root.update(data);
    renderer.render(scene, camera);
}

onresize = function () {
    var w = window.innerWidth;
    var h = w / Shared.W * Shared.H;
    canvas.style.width = w;
    canvas.style.height = h;
    Shared.w = w;
    Shared.h = h;
}

onresize();



