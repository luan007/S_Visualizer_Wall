import { THREERenderable, BuildRenderable, Renderable } from "../base.js"
import { ease, remap } from "../ease.js"
import { Shared } from "../env.js"
import * as THREE from "three";

export class THREERenderTarget extends THREERenderable {
    constructor(e) {
        super(e);

        this.canvas = document.getElementById('maincanvas');
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        //0x211D1D
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setSize(Shared.W, Shared.H);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.camera = new THREE.PerspectiveCamera(
            20,
            Shared.W / Shared.H,
            1,
            5000
        );
        this.camera.position.z = 500;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000, 1, 20000);
        this.scene.add(this.group);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
