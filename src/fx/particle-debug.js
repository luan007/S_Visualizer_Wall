import { pMoveBehavior, pPointsRenderer } from "./particle-modules.js";
import { pSys, pBehavior } from "./particles.js";
import { THREERenderable, BuildRenderable } from "../base.js";

class pTargetBehavior extends pBehavior {

    constructor(params) {
        super(params);
        this.params.power = this.params.power || 0.03;
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
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (var x = 0; x < canvas.width; x+=2) {
            for (var y = 0; y < canvas.height; y+=2) {
                var alpha = data[(y * canvas.width + x) * 4 + 4];
                if (alpha > 0) {
                    this.target.push([x - canvas.width / 2, canvas.height / 2 - y, -300]);
                    this.targetColor.push([((x + y) / 100) % 0.3, ((x + y) / 300) % 1, alpha]);
                }
            }
        }
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
            pt.bag.target = this.target[i % this.target.length];
            pt.bag.targetColor = this.targetColor[i % this.targetColor.length];
        }
    }

    onUpdate(pt, i, t) {
        if (!pt.bag.hasTarget) return;
        pt.a[0] += (pt.bag.target[0] - pt.p[0]) * this.params.power;
        pt.a[1] += (pt.bag.target[1] - pt.p[1]) * this.params.power;
        pt.a[2] += (pt.bag.target[2] - pt.p[2]) * this.params.power;

        pt.c[0] += (pt.bag.targetColor[0] - pt.c[0]) * this.params.powerColor;
        pt.c[1] += (pt.bag.targetColor[1] - pt.c[1]) * this.params.powerColor;
        pt.c[2] += (pt.bag.targetColor[2] - pt.c[2]) * this.params.powerColor;
    }
}

class pDampingBehavior extends pBehavior {
    constructor(params) {
        super(params);
        this.params.power = this.params.power || 0.97;
    }

    onUpdate(pt, i, t) {
        pt.v[0] *= this.params.power;
        pt.v[1] *= this.params.power;
        pt.v[2] *= this.params.power;
    }
}

export var ParticleSystemDemo = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.98 });
    var target = new pTargetBehavior({ enabled: true, power: 0.0001, powerColor: 0.1 });
    target.generateDemoTarget("北京721双闪车队");
    var render = new pPointsRenderer({ size: 122000, enabled: true });
    var sys = new pSys(122000,
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
        for (var i = 0; i < 122000 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = Infinity;
                pt.p = [0, 0, 0];
                pt.c = [0.3, 0.3, 0.3];
                pt.v = [3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5)];
            });
        }
        sys.update(1);
        sys.render();
    };
});