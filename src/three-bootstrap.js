import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "./base.js";

var canvas = document.getElementById('maincanvas');

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    // alpha: true,
    canvas: canvas
});

renderer.setClearColor(new THREE.Color(0x000000), 1);
renderer.setSize(Shared.W, Shared.H);

var camera = new THREE.PerspectiveCamera(
    60,
    Shared.W / Shared.H,
    0.1,
    1000
);
camera.position.z = 50;

var root = new THREERenderable();
// var ambientLight = new THREE.AmbientLight(0xffff00);
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000, 1, 1000);
scene.add(root.group);
// scene.add(ambientLight);

root.build((group) => {
    var geometry = new THREE.TetrahedronGeometry(5, 0);
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    return (o) => {
        mesh.rotateX(0.01);
        mesh.rotateY(0.02);
    }
})


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



