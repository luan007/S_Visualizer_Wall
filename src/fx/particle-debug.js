import { pMoveBehavior, pPointsRenderer } from "./particle-modules.js";
import { pSys, pBehavior } from "./particles.js";
import { THREERenderable, BuildRenderable } from "../base.js";
import { Shared } from "../base.js";
import * as glmat from "gl-matrix";
import "./perlin.js";


class pTargetBehavior extends pBehavior {

    constructor(params) {
        super(params);
        this.params.power = this.params.power || 0.03;
        this.params.clamp = this.params.clamp || 10;
        this.target = [];
        this.targetColor = [];
    }

    generateDemoTarget(txt) {
        let canvas = document.createElement('canvas');
        canvas.width = 850;
        canvas.height = 100;
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 850, 100);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 80px PingFang SC";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, 850 / 2, 100 / 2);

        this.target = [];
        this.targetColor = [];
        var q = 0;
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (var x = 0; x < canvas.width; x += 2) {
            for (var y = 0; y < canvas.height; y += 2) {
                var alpha = data[(y * canvas.width + x) * 4 + 3];
                if (alpha > 0) {
                    // console.log(alpha);
                    this.target.push([x - canvas.width / 2, canvas.height / 2 - y, -300]);
                    // this.targetColor.push([((x + y) / 100) % 0.3, ((x + y) / 300) % 1, alpha]);
                    this.targetColor.push([1, 1, 1]);
                    q++;
                }
            }
        }
        console.log(txt + " consumed (particle) " + q);
    }

    onInit(pt, i) {
        pt.bag.target = pt.bag.target || [0, 0, 0];
        pt.bag.targetColor = pt.bag.targetColor || [0, 0, 0];
        pt.bag.hasTarget = pt.bag.hasTarget == undefined ? true : pt.bag.hasTarget;
    }

    onEmit(pt, i) {
        // pt.bag.target = [(i % 850) - 850 / 2, Math.floor(i / 850) - 100 / 2, -300];
        if (this.target.length == 0) {
            pt.bag.hasTarget = false;
        } else {
            pt.bag.hasTarget = true;
            pt.bag.target = this.target[i % this.target.length];
            pt.bag.targetColor = this.targetColor[i % this.targetColor.length];
        }
    }

    onUpdate(pt, i, t) {
        if (!pt.bag.hasTarget) return;
        // glmat.vec3.lerp(pt.a, pt.p, pt.bag.target, this.params.power);
        glmat.vec3.sub(pt.a, pt.bag.target, pt.p);
        var len = glmat.vec3.len(pt.a) * this.params.power;
        glmat.vec3.normalize(pt.a, pt.a);
        glmat.vec3.scale(pt.a, pt.a, len > this.params.clamp ? this.params.clamp : len);

        pt.v[0] *= 0.98;
        pt.v[1] *= 0.98;
        pt.v[2] *= 0.98;

        // pt.v[0] += noise.perlin3(pt.p[0] / 10, pt.p[1] / 10, Shared.t) * .3;
        // pt.v[1] += noise.perlin3(pt.p[1] / 10, pt.p[2] / 10, Shared.t) * .3;
        // pt.v[2] += noise.perlin3(pt.p[2] / 10, pt.p[0] / 10, Shared.t) * .3;

        // pt.a[0] += (pt.bag.target[0] - pt.p[0]) * this.params.power;
        // pt.a[1] += (pt.bag.target[1] - pt.p[1]) * this.params.power;
        // pt.a[2] += (pt.bag.target[2] - pt.p[2]) * this.params.power;

        pt.c[0] += (pt.bag.targetColor[0] - pt.c[0]) * this.params.powerColor;
        pt.c[1] += (pt.bag.targetColor[1] - pt.c[1]) * this.params.powerColor;
        pt.c[2] += (pt.bag.targetColor[2] - pt.c[2]) * this.params.powerColor;
    }
}

class pDampingBehavior extends pBehavior {
    constructor(params) {
        super(params);
        this.counter = 0;
        this.params.power = this.params.power || 0.97;
    }

    onUpdate(pt, i, t) {
        pt.v[0] *= this.params.power;
        pt.v[1] *= this.params.power;
        pt.v[2] *= this.params.power;
    }
}

class pBlinkBehavior extends pBehavior {
    constructor(params) {
        super(params);
    }

    onUpdate(pt, i, t) {
        var a = Math.sin((i / 100 + Shared.t * 10)) * 0.2;
        pt.c[0] = pt.c[1] = pt.c[2] = a;
    }
}


export var Scene = new THREERenderable();


var MainSystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
    var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 0.2 });
    target.generateDemoTarget("北京721双闪车队");
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            target,
            velocity,
            damp,
            position
        ],
        [
            render
        ]);
    group.add(render.mesh);
    return () => {
        for (var i = 0; i < 50000 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = Infinity;
                pt.p = [0, 0, 0];
                pt.c = [0.3, 0.3, 0.3];
                pt.v = [0.2 * (Math.random() - 0.5), 0.2 * (Math.random() - 0.5), 0.2 * (Math.random() - 0.5)];
            });
        }
        sys.update(1);
        sys.render();
    };
}).addTo(Scene);

var SecondarySystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
    var blink = new pBlinkBehavior({ enabled: true });
    // var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 0.2 });
    // target.generateDemoTarget("北京721双闪车队");
    var render = new pPointsRenderer({ size: 5000, enabled: true });
    var sys = new pSys(5000,
        [
            velocity,
            damp,
            position,
            // blink
        ],
        [
            render
        ]);
    
    render.material.sizeAttenuation = true;
    render.material.size = 0.3;
    group.add(render.mesh);
    return () => {
        for (var i = 0; i < 50000 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = Infinity;
                pt.p = [0, 0, 0];
                pt.c = [0.5, 0.5, 0.5];
                pt.v = [2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)];
            });
        }
        sys.update(1);
        sys.render();
    };
}).addTo(Scene);

