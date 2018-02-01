import { THREERenderable, BuildRenderable, Renderable, SlideEase } from "../base.js"
import { ease, remap, easeAll } from "../ease.js"
import { Shared } from "../env.js"
import * as DOMFx from "../fx/dom.js";
import * as THREE from "three";

import {
    pBlinkBehavior, pDampingBehavior, pDragLineRenderer, pFadeBehavior,
    pGravityBehavior, pLinesRenderer, pMoveBehavior, pNoiseBehavior, pPointsRenderer,
    pRandomBehavior, pTargetBehavior
} from "../fx/particle-modules.js";
import { pSys, pBehavior, pRenderer } from "../fx/particles.js";

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

// var T = new SlideEase();
// window.T = T;

// export var EveryGoingTarget = BuildRenderable((group) => {
//     var target = new pTargetBehavior({ enabled: true, power: 10.1, powerColor: 0.1, clamp: .5 });
//     target.generateDemoTarget("#");

//     var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.9 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             target,
//             damp,
//             velocity,
//             position,
//             fade,
//         ],
//         [
//             render,
//         ]);

//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     return () => {

//         for (var i = 0; i < 100 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.006;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 pt.p = [(Math.random() - 0.5) * 330, (Math.random() - 0.5) * 330, (Math.random() - 0.5) * 3];
//                 pt.c = [1, 1, 1];
//                 pt.v = [(Math.random() - 0.5) * 55, (Math.random() - 0.5) * 55, (Math.random() - 0.5) * 55];
//                 pt.alpha = 0;
//             });
//         }

//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
//         sys.render();
//     };
// });

// export var InterfereSystem = BuildRenderable((group) => {

//     var target = new pTargetBehavior({ enabled: true, power: 10.1, powerColor: 0.1, clamp: .5 });
//     target.generateDemoTarget("#");

//     var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.93 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             target,
//             damp,
//             velocity,
//             position,
//             fade,
//         ],
//         [
//             render,
//         ]);
//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     return () => {

//         for (var i = 0; i < 100 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.006;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 pt.p = [0, 0, -300];
//                 pt.c = [1, 1, 1];
//                 pt.v = [0, 0, 0];
//                 pt.alpha = 0;
//             });
//         }

//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
//         sys.render();
//     };
// });

// export var FireSystem = BuildRenderable((group) => {

//     var target = new pTargetBehavior({ enabled: true, power: 1.1, powerColor: 0.1, clamp: .1 });
//     target.generateDemoTarget("#");

//     var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.93 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             target,
//             damp,
//             velocity,
//             position,
//             fade,
//         ],
//         [
//             render,
//         ]);
//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     return () => {

//         for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.006;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 pt.p = [100 * (Math.random() - 0.5), -30, -300];
//                 pt.c = [1, 1, 1];
//                 pt.v = [0, Math.random() * 3, 0];
//                 pt.alpha = 0;
//             });
//         }

//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
//         sys.render();
//     };
// });

// export var GoodHashSystem = BuildRenderable((group) => {

//     var target = new pTargetBehavior({ enabled: true, power: 0.01, powerColor: 0.1, clamp: 1.1 });
//     target.generateDemoTarget("#");

//     var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.67 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             target,
//             damp,
//             velocity,
//             position,
//             fade,
//         ],
//         [
//             render,
//         ]);
//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     return () => {

//         for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.003;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 pt.p = [400 * (Math.random() - 0.5), 100 * (Math.random() - 0.5), -300];
//                 pt.c = [1, 1, 1];
//                 pt.v = [0, 0, 0];
//                 pt.alpha = 0;
//             });
//         }

//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
//         sys.render();
//     };
// });

// //entry/
// export var GravityBeltSystem = BuildRenderable((group) => {

//     var gravity = new pGravityBehavior({ eanbled: true, g: 3000, clamp: 0.01 });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.97 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             gravity,
//             damp,
//             velocity,
//             position,
//             fade,
//             blink
//         ],
//         [
//             render,
//         ]);
//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     return () => {

//         for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.003;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 pt.p = [1400 * (Math.random() - 0.5), 100 * (Math.random() - 0.5), -300];
//                 pt.c = [1, 1, 1];
//                 pt.v = [0, 0, 0];
//                 pt.alpha = 0;
//             });
//         }

//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
//         sys.render();
//     };
// });

// export var WaveSystem = BuildRenderable((group) => {
//     var gravity = new pGravityBehavior({ eanbled: true, g: -30, clamp: 0.01 });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.97 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             gravity,
//             damp,
//             velocity,
//             position,
//             fade,
//             blink
//         ],
//         [
//             render,
//         ]);
//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     return () => {

//         for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.003;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 // pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 pt.p = [Math.sin(deg) * r * 3, Math.cos(deg) * r * 3, - 300 + (Math.random() - 0.5) * 10];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 // pt.p = [10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5), -300];
//                 pt.c = [1, 1, 1];
//                 pt.v = [0, 0, 0];
//                 pt.alpha = 0;
//             });
//         }

//         T.update();

//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(T.v);
//         sys.render();
//     };
// });

// export var StarSystem = BuildRenderable((group) => {
//     var gravity = new pGravityBehavior({ eanbled: true, g: 50000, clamp: 1, point: [0, 0, 100] });
//     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
//     var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
//     var position = new pMoveBehavior({ enabled: true, stage: "position" });
//     var blink = new pBlinkBehavior({ enabled: true });
//     var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
//     var render = new pPointsRenderer({ size: 30000, enabled: true });
//     var sys = new pSys(30000,
//         [
//             gravity,
//             damp,
//             velocity,
//             position,
//             fade,
//             blink
//         ],
//         [
//             render,
//         ]);

//     render.material.sizeAttenuation = true;
//     render.material.size = 4;
//     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
//     group.add(render.mesh);
//     group.translateZ(-500);
//     return () => {
//         render.mesh.rotateY(0.0003);
//         render.mesh.rotateX(0.0006);
//         for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 500 && i < sys.seek(); i++) {
//             sys.emit((pt) => {
//                 pt.l = 1;
//                 pt.vl = 0.006;
//                 let deg = Math.random() * Math.PI * 2;
//                 let r = Math.random();
//                 pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
//                 pt.p = [Math.sin(deg) * r * 3, Math.cos(deg) * r * 3, - 300 + (Math.random() - 0.5) * 10];
//                 // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
//                 pt.p = [0, 0, -100];
//                 pt.c = [1, 1, 1];
//                 pt.v = [(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, 0];
//                 pt.alpha = 0;
//             });
//         }
//         T.update();
//         // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
//         // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);
//         // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
//         // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
//         sys.update(T.v);
//         sys.render();
//     };
// });


export class ParticleBackground extends THREERenderable {
    constructor(e) {

        super(e);
        this.curConfig = 3;

        /**
         *      this.target,
                this.gravity,
                this.damp,
                this.velocity,
                this.position,
                this.fade,
                this.blink
         */


        //basis
        this.cacheState = false;
        this.isVisible = false;
        this.transition = false;
        //-basis

        this.t = 0;
        this.params = {
            simulationSpeedEase: {
                value: 0, target: 1, ease: 0.0004
            },
            simulationSpeed: {
                value: 0, target: 1, ease: 0.05
            },
            rotationSpeed: {
                value: 0, target: 1, ease: 0.2
            },
            rotateX: {
                value: 0, target: 0.0003, ease: 0.2
            },
            rotateY: {
                value: 0, target: 0.0006, ease: 0.2
            },
            emissionRate: {
                value: 0, target: 500, ease: 0.5
            },
            posZ: {
                value: 0, target: -500, ease: 0.1
            }
        };

        this.size = 30000;        

        this.random = new pRandomBehavior({ enabled: true, power: 0.6 });
        this.target = new pTargetBehavior({ enabled: false, power: 10.1, powerColor: 0.1, clamp: .5 });
        this.target.generateDemoTarget("#");
        this.velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
        this.position = new pMoveBehavior({ enabled: true, stage: "position" });
        this.gravity = new pGravityBehavior({ eanbled: true, g: 50000, clamp: 1, point: [0, 0, 100] });
        this.damp = new pDampingBehavior({ enabled: true, power: 0.99 });
        this.blink = new pBlinkBehavior({ enabled: true });
        this.fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 4 });
        this.renderer = new pPointsRenderer({ size: this.size, enabled: true });

        // this.renderer.mesh.translateZ(-500);

        this.renderer.material.sizeAttenuation = true;
        this.renderer.material.size = 4;
        this.renderer.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
        this.group.add(this.renderer.mesh);

        this.pSys = new pSys(this.size,
            [
                this.target,
                this.gravity,
                this.random,
                this.damp,
                this.velocity,
                this.position,
                this.fade,
                this.blink
            ],
            [
                this.renderer
            ]);

        this.configurations = [
            //special configuration / exit.
            () => {

                this.params.posZ.target = -500;
                this.params.posZ.ease = 0.1;

                this.target.params.enabled = false;

                this.blink.params.enabled = true;

                this.fade.params.enabled = true;

                this.gravity.params.enabled = false;

                this.damp.params.enabled = true;
                this.damp.params.power = 0.99;

                this.params.rotationSpeed.target = 1;
                this.params.rotateX.target = 0.002;
                this.params.rotateY.target = 0.001;

            },

            //hash1
            () => {

                // this.params.simulationSpeedEase.target = 0.1;
                // this.params.simulationSpeed.target = 0;

                this.params.posZ.target = -500;
                this.params.posZ.ease = 0.01;

                this.target.params.enabled = true;
                this.target.params.power = 1;
                this.target.params.powerColor = 1;
                this.target.params.clamp = this.t;
                this.target.params.shift = [0, 0, this.t * 0.1];
                this.blink.params.enabled = true;

                this.fade.params.enabled = true;

                this.gravity.params.enabled = false;
                this.gravity.params.g = 3000;
                this.gravity.params.point = [0, 0, -300];
                this.gravity.params.clamp = 2.1;

                // if(this.t >= 1.2) {
                // this.gravity.params.enabled = false;
                // }

                this.damp.params.enabled = true;
                this.damp.params.power = 0.9;

                this.params.rotationSpeed.target = 0;
                this.params.rotateX.target = 0.0;
                this.params.rotateY.target = 0.0;


                this.params.emissionRate.target = 1;
                this.params.emissionRate.value = 1;

                if (this.t > 2.3) {
                    this.target.params.enabled = false;
                    this.damp.params.power = 0.9
                }

                if (this.t < 2.6) {
                    for (var i = 0; this.pSys.available.length > this.size / 3 && i < 1000; i++) {
                        this.pSys.emit((pt) => {
                            pt.l = 1;
                            pt.vl = 0.0001;
                            let deg = Math.random() * Math.PI * 2;
                            let r = Math.random();
                            pt.p = [1000 * (Math.random() - 0.5), 1 * (Math.random() - 0.5), 0];
                            pt.c = [1, 1, 1];
                            pt.v = [(Math.random() * 0.5 - 1) * 10, ((Math.random() - this.YOffset) * this.YFactor), Math.random() * 200];
                            pt.alpha = 0;
                        });
                    }
                } else if (this.t > 2.6) {
                    this.shuffleEffects();
                }
            },

            //normal
            () => {

                this.params.posZ.target = -300;
                this.params.posZ.ease = 0.005;
                this.params.simulationSpeedEase.target = 0.2;
                this.params.simulationSpeed.target = 0;

                this.target.params.enabled = false;

                this.blink.params.enabled = true;

                this.fade.params.enabled = true;

                this.gravity.params.enabled = true;
                this.gravity.params.g = + Math.sin(this.t * 1.5) * 500;
                this.gravity.params.clamp = 0.5;
                this.damp.params.enabled = true;
                this.damp.params.power = 0.95;

                this.gravity.params.point = [0, 0, 0];
                if (this.t >= 1) {
                    this.gravity.params.point = [0, 0, 10];
                    this.gravity.params.g = -5000;
                    this.gravity.params.clamp = 0.1;
                    Shared.implode = true;
                }


                this.params.rotationSpeed.target = 1;
                this.params.rotateX.target = 0.002;
                this.params.rotateY.target = 0.001;

                for (var i = 0; i < this.pSys.seek() && i < 300 * this.params.emissionRate.value; i++) {
                    this.pSys.emit((pt) => {
                        pt.l = 1;
                        pt.vl = 0.005;
                        pt.p = [0, 0, 0];
                        pt.c = [1, 1, 1];
                        pt.v = [(Math.random() - 0.5) * 300, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 0.5];
                        pt.alpha = 0;
                    });
                }


            },

            //normal2
            () => {
                this.params.posZ.target = -300;
                this.params.posZ.ease = 0.02;
                this.params.simulationSpeedEase.target = 0.2;
                this.params.simulationSpeed.target = 0;

                this.target.params.enabled = false;
                this.blink.params.enabled = true;
                this.fade.params.enabled = true;

                this.gravity.params.enabled = true;
                this.gravity.params.g = -10;
                this.gravity.params.clamp = 0.02;
                this.gravity.params.point = [0, 0, -300];
                this.damp.params.enabled = true;
                this.damp.params.power = 0.97;

                if (this.t >= 1.8) {
                    Shared.implode = true;
                }
                if (this.t >= 1.99) {
                    this.gravity.params.point = [0, 0, -310];
                    this.gravity.params.g = -500000;
                    this.gravity.params.clamp = 100;
                }

                this.params.rotationSpeed.target = 1.0;
                this.params.rotateX.target = -0.0003;
                this.params.rotateY.target = 0.0002;

                for (var i = 0; i < this.pSys.seek() && i < 10000 * this.params.emissionRate.value; i++) {
                    this.pSys.emit((pt) => {
                        pt.l = 1;
                        pt.vl = 0.006;
                        let deg = Math.random() * Math.PI * 2;
                        let r = Math.random();
                        // pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                        pt.p = [Math.sin(deg) * r * 30, Math.cos(deg) * r * 30, -300];
                        // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                        pt.c = [1, 1, 1];
                        pt.v = [0, 0, 0];
                        pt.alpha = 0;
                    });
                }

            },

            //normal3
            () => {

                this.params.posZ.target = -300;
                this.params.posZ.ease = 0.02;
                this.params.simulationSpeedEase.target = 0.1;
                this.params.simulationSpeed.target = 0;

                this.target.params.enabled = false;
                this.blink.params.enabled = true;
                this.fade.params.enabled = true;

                this.gravity.params.enabled = true;
                this.gravity.params.g = 3500;
                this.gravity.params.clamp = 0.3;
                this.gravity.params.point = [0, 0, 0];
                this.damp.params.enabled = true;
                this.damp.params.power = 0.98;

                if (this.t >= 1.8) {
                    Shared.implode = true;
                }
                if (this.t >= 1.99) {
                    this.gravity.params.point = [0, 0, 0];
                    this.gravity.params.g = -590;
                    this.gravity.params.clamp = 0.003;
                }

                this.params.rotationSpeed.target = 1.0;
                this.params.rotateX.target = -0.0003;
                this.params.rotateY.target = 0.0002;

                for (var i = 0; i < this.pSys.seek() && i < 100 * this.params.emissionRate.value; i++) {
                    this.pSys.emit((pt) => {
                        pt.l = 1;
                        pt.vl = 0.006;
                        pt.p = [1400 * (Math.random() - 0.5), 1 * (Math.random() - 0.5), 0];
                        pt.c = [1, 1, 1];
                        pt.v = [(0.5 - Math.random()) * 1, (0.5 - Math.random()) * 31, 0];
                        pt.alpha = 0;
                    });
                }

            }
        ];
    }

    shuffleEffects() {
        this.t = 0;
        var offset = 2;
        var length = this.configurations.length - offset
        return this.setConfig(
            4
        //  2 //   o
        )
        var o = Math.floor(Math.random() * length) + offset;
        while(o == this.last) {
            o = Math.floor(Math.random() * length) + offset;;
        }
        this.last = o;
        this.setConfig(
            o
        )
    }

    shuffleEntry() {
        this.t = 0;
        var offset = 1;
        var length = 1
        this.setConfig(
            Math.floor(Math.random() * length) + offset
        )
    }

    render() {

        Shared.implode = false;

        this.t += 0.01;
        this.configurations[this.curConfig] && this.configurations[this.curConfig]();

        easeAll(this.params);

        this.renderer.mesh.position.z = this.params.posZ.value;
        this.renderer.mesh.rotateX(this.params.rotateX.value * this.params.rotationSpeed.value);
        this.renderer.mesh.rotateY(this.params.rotateY.value * this.params.rotationSpeed.value);
        this.params.simulationSpeed.ease = this.params.simulationSpeedEase.value;
        this.pSys.update(this.params.simulationSpeed.value);
        this.pSys.render();


        if (!this.cacheState && this.pSys.available.length == this.size) {
            this.isVisible = false;
            this.transition = false;
            this.renderer.mesh.rotation.x = 0;
            this.renderer.mesh.rotation.y = 0;
            this.renderer.mesh.rotation.translateZ = 0;
        }
    }

    setConfig(j) {
        this.t = 0;
        this.curConfig = j;
    }

    in(t) {
        if (this.cacheState == true) return;
        this.YFactor = Math.random() * 100;
        this.YOffset = (Math.random() * 1 - 0.5);
        this.isVisible = true;
        this.cacheState = true;

        this.shuffleEntry();
        this.params.simulationSpeedEase.value = 0;
        this.params.simulationSpeedEase.target = 0;
        this.params.simulationSpeed.value = 1;
        this.params.simulationSpeed.target = 1;
        this.params.emissionRate.target = 1;
        this.params.emissionRate.value = 0;

        this.params.rotateX.value = 0;
        this.params.rotateY.value = 0;
        this.params.rotateX.target = 0;
        this.params.rotateY.target = 0;

        this.renderer.mesh.rotation.x = 0;
        this.renderer.mesh.rotation.y = 0;
        this.renderer.mesh.rotation.z = 0;
        this.renderer.mesh.rotation.w = 0;
    }

    out() {
        if (this.cacheState == false) return;
        this.cacheState = false;
        this.transition = true;
        this.params.simulationSpeed.target = 0.7;
        this.params.simulationSpeedEase.target = 0.01;
        this.params.emissionRate.target = 0;


        for(var i = 0; i < this.pSys.ps.length; i++){
            this.pSys.ps[i].vl = 0.005;
        }


        this.setConfig(0);
        // this.domElement.removeClass("show");
    }


}