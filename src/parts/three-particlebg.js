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

var T = new SlideEase();
window.T = T;

export var EveryGoingTarget = BuildRenderable((group) => {
    var target = new pTargetBehavior({ enabled: true, power: 10.1, powerColor: 0.1, clamp: .5 });
    target.generateDemoTarget("#");

    var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.9 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            target,
            damp,
            velocity,
            position,
            fade,
        ],
        [
            render,
        ]);

    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {

        for (var i = 0; i < 100 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.006;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [(Math.random() - 0.5) * 330, (Math.random() - 0.5) * 330, (Math.random() - 0.5) * 3];
                pt.c = [1, 1, 1];
                pt.v = [(Math.random() - 0.5) * 55, (Math.random() - 0.5) * 55, (Math.random() - 0.5) * 55];
                pt.alpha = 0;
            });
        }

        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
});

export var InterfereSystem = BuildRenderable((group) => {

    var target = new pTargetBehavior({ enabled: true, power: 10.1, powerColor: 0.1, clamp: .5 });
    target.generateDemoTarget("#");

    var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.93 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            target,
            damp,
            velocity,
            position,
            fade,
        ],
        [
            render,
        ]);
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {

        for (var i = 0; i < 100 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.006;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [0, 0, -300];
                pt.c = [1, 1, 1];
                pt.v = [0, 0, 0];
                pt.alpha = 0;
            });
        }

        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
});

export var FireSystem = BuildRenderable((group) => {

    var target = new pTargetBehavior({ enabled: true, power: 1.1, powerColor: 0.1, clamp: .1 });
    target.generateDemoTarget("#");

    var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.93 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            target,
            damp,
            velocity,
            position,
            fade,
        ],
        [
            render,
        ]);
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {

        for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.006;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [100 * (Math.random() - 0.5), -30, -300];
                pt.c = [1, 1, 1];
                pt.v = [0, Math.random() * 3, 0];
                pt.alpha = 0;
            });
        }

        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
});

export var GoodHashSystem = BuildRenderable((group) => {

    var target = new pTargetBehavior({ enabled: true, power: 0.01, powerColor: 0.1, clamp: 1.1 });
    target.generateDemoTarget("#");

    var gravity = new pGravityBehavior({ eanbled: true, g: 300000, clamp: 0.03 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.67 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            target,
            damp,
            velocity,
            position,
            fade,
        ],
        [
            render,
        ]);
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {

        for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.003;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [400 * (Math.random() - 0.5), 100 * (Math.random() - 0.5), -300];
                pt.c = [1, 1, 1];
                pt.v = [0, 0, 0];
                pt.alpha = 0;
            });
        }

        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
});

//entry/
export var GravityBeltSystem = BuildRenderable((group) => {

    var gravity = new pGravityBehavior({ eanbled: true, g: 3000, clamp: 0.01 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.97 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            gravity,
            damp,
            velocity,
            position,
            fade,
            blink
        ],
        [
            render,
        ]);
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {

        for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.003;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [1400 * (Math.random() - 0.5), 100 * (Math.random() - 0.5), -300];
                pt.c = [1, 1, 1];
                pt.v = [0, 0, 0];
                pt.alpha = 0;
            });
        }

        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
});

export var WaveSystem = BuildRenderable((group) => {
    var gravity = new pGravityBehavior({ eanbled: true, g: -30, clamp: 0.01 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.97 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            gravity,
            damp,
            velocity,
            position,
            fade,
            blink
        ],
        [
            render,
        ]);
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {

        for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 100 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.003;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                // pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                pt.p = [Math.sin(deg) * r * 3, Math.cos(deg) * r * 3, - 300 + (Math.random() - 0.5) * 10];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                // pt.p = [10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5), -300];
                pt.c = [1, 1, 1];
                pt.v = [0, 0, 0];
                pt.alpha = 0;
            });
        }

        T.update();

        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(T.v);
        sys.render();
    };
});

export var StarSystem = BuildRenderable((group) => {
    var gravity = new pGravityBehavior({ eanbled: true, g: 50000, clamp: 1, point: [0, 0, 100] });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            gravity,
            damp,
            velocity,
            position,
            fade,
            blink
        ],
        [
            render,
        ]);

    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    group.translateZ(-500);
    return () => {
        render.mesh.rotateY(0.0003);
        render.mesh.rotateX(0.0006);
        for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * 500 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.006;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                pt.p = [Math.sin(deg) * r * 3, Math.cos(deg) * r * 3, - 300 + (Math.random() - 0.5) * 10];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [0, 0, -100];
                pt.c = [1, 1, 1];
                pt.v = [(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, 0];
                pt.alpha = 0;
            });
        }
        T.update();
        // target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        // random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);
        // gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(T.v);
        sys.render();
    };
});

export class ParticleBackground extends THREERenderable {
    constructor(e) {
        super(e);

        //basis
        this.cacheState = false;
        this.isVisible = false;
        this.transition = false;
        //-basis

        this.params = {
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
            }
        };

        this.target = new pTargetBehavior({ enabled: false, power: 10.1, powerColor: 0.1, clamp: .5 });
        this.target.generateDemoTarget("#");

        this.velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
        this.position = new pMoveBehavior({ enabled: true, stage: "position" });
        this.gravity = new pGravityBehavior({ eanbled: true, g: 50000, clamp: 1, point: [0, 0, 100] });
        this.damp = new pDampingBehavior({ enabled: true, power: 0.99 });
        this.blink = new pBlinkBehavior({ enabled: true });
        this.fade = new pFadeBehavior({ enabled: true, phase: 'life', curve: 8 });
        this.renderer = new pPointsRenderer({ size: 30000, enabled: true });

        this.renderer.mesh.translateZ(-500);

        this.renderer.material.sizeAttenuation = true;
        this.renderer.material.size = 4;
        this.renderer.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
        this.group.add(this.renderer.mesh);

        this.pSys = new pSys(30000,
            [
                this.target,
                this.gravity,
                this.damp,
                this.velocity,
                this.position,
                this.fade,
                this.blink
            ],
            [
                this.renderer
            ]);
    }

    render() {
        easeAll(this.params);
        this.renderer.mesh.rotateX(this.params.rotateX.value * this.params.rotationSpeed.value);
        this.renderer.mesh.rotateY(this.params.rotateY.value * this.params.rotationSpeed.value);

        for (var i = 0; i < Math.abs(Math.sin(Shared.t)) * this.params.emissionRate.value && i < this.pSys.seek(); i++) {
            this.pSys.emit((pt) => {
                pt.l = 1;
                pt.vl = 0.006;
                let deg = Math.random() * Math.PI * 2;
                let r = Math.random();
                pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
                pt.p = [Math.sin(deg) * r * 3, Math.cos(deg) * r * 3, - 300 + (Math.random() - 0.5) * 10];
                // pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
                pt.p = [0, 0, -100];
                pt.c = [1, 1, 1];
                pt.v = [(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, 0];
                pt.alpha = 0;
            });
        }

        this.pSys.update(this.params.simulationSpeed.value);
        this.pSys.render();
    }


    in(t) {
        if (this.cacheState == true) return;
        this.cacheState = true;
    }

    out() {
        if (this.cacheState == false) return;
        this.cacheState = false;
        this.transition = true;
        this.domElement.removeClass("show");
    }


}