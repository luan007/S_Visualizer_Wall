import { THREERenderable, BuildRenderable, Renderable } from "../base.js"
import { ease, remap } from "../ease.js"
import { Shared } from "../env.js"
import * as THREE from "three";

import {} from "../fx/particle-modules.js";
import {pSys, pBehavior, pRenderer} from "../fx/particles.js";

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


var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 2 });
target.generateDemoTarget("#");

export var WaveSystem = BuildRenderable((group) => {
    var gravity = new pGravityBehavior({ eanbled: true, g: 1000, clamp: 0.2 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var noise = new pNoiseBehavior({ enabled: true, power: 15 });
    var damp = new pDampingBehavior({ enabled: true, power: 0.9 });
    var random = new pRandomBehavior({ enabled: true, power: 0.6 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, speed: 0.01 });
    var render = new pPointsRenderer({ size: 20000, enabled: true });
    var domrenderer = new pDomRenderer({ size: 50, enabled: true })
    var sys = new pSys(20000,
        [
            target,
            gravity,
            random,
            velocity,
            damp,
            // noise,
            position,
            fade,
            blink
        ],
        [
            render,
            domrenderer
        ]);

    for (var i = 0; i < 20000 && i < sys.seek(); i++) {
        sys.emit((pt) => {
            pt.l = Infinity;
            let deg = Math.random() * Math.PI * 2;
            let r = Math.random();

            //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
            // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
            pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
            pt.p = [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30];
            pt.c = [1, 1, 1];
            pt.v = [(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5];
            pt.alpha = 0;
        });
    }
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {
        target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // console.log(gravity.params.enabled);

        // target.params.enabled = Shared.timeline.t < 4;
        // gravity.params.enabled = gravity.params.enabled && Shared.timeline.t < 7;
        gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
});