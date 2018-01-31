import * as THREE from "three";
import { Renderable, THREERenderable, BuildRenderable } from "../base.js";
import { Shared } from "../env.js";
import { pSys, pBehavior, pRenderer } from "./particles.js";
import * as glmat from "gl-matrix";

export class pMoveBehavior extends pBehavior {
    constructor(params) {
        super(params);
    }
    onUpdate(pt, i, t) {
        if (this.params.stage === "velocity") {
            pt.v[0] += pt.a[0] * t;
            pt.v[1] += pt.a[1] * t;
            pt.v[2] += pt.a[2] * t;
        } else if (this.params.stage === "position") {
            pt.p[0] += pt.v[0] * t;
            pt.p[1] += pt.v[1] * t;
            pt.p[2] += pt.v[2] * t;
        }
    }
}

export class pPointsRenderer extends pRenderer {
    constructor(params) {
        super(params);
        params.size = params.size || 0;
        var verticies = [];
        var colors = [];
        // this.geometry = new THREE.Geometry();
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(params.size * 3);
        this.colors = new Float32Array(params.size * 3);
        var texture = new THREE.ImageUtils.loadTexture("../assets/Dot.png");
        this.material = new THREE.PointsMaterial({
            vertexColors: true,
            size:5,
            transparent: true,
            // opacity: 1,
            // alphaTest: 0.5,
            sizeAttenuation: false,
            // map: texture,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        for (var i = 0; i < params.size; i++) {
            verticies.push(new THREE.Vector3(0, 0, 0));
            colors.push(new THREE.Color(1, 1, 1));
        }
        // this.geometry.vertices = verticies;
        // this.geometry.colors = colors;


        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3).setDynamic(true));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));
        this.geometry.setDrawRange(0, this.params.size);
        this.mesh = new THREE.Points(this.geometry, this.material);
    }
    onRender(sys) {
        var vpos = 0;
        var cpos = 0;
        for (var i = 0; i < sys.ps.length; i++) {
            let c = sys.ps[i];
            if (c._dead) continue;
            // this.geometry.vertices[i].x = c.p[0];
            // this.geometry.vertices[i].y = c.p[1];
            // this.geometry.vertices[i].z = c.p[2];

            // this.geometry.colors[i].r = c.c[0];
            // this.geometry.colors[i].g = c.c[1];
            // this.geometry.colors[i].b = c.c[2];

            this.positions[vpos++] = c.p[0];
            this.positions[vpos++] = c.p[1];
            this.positions[vpos++] = c.p[2];

            this.colors[cpos++] = c.c[0] * c.alpha;
            this.colors[cpos++] = c.c[1] * c.alpha;
            this.colors[cpos++] = c.c[2] * c.alpha;

        }
        // this.geometry.verticesNeedUpdate =
        //     this.geometry.colorsNeedUpdate = true;

        this.geometry.setDrawRange(0, vpos / 3);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }
}

export class pLinesRenderer extends pRenderer {
    constructor(params) {
        super(params);
        params.size = params.size || 0;
        params.maxPerNode = params.maxPerNode || 2;
        params.distSq = params.distSq || -1;

        this.a = 1;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(params.size * 3 * 2);
        this.colors = new Float32Array(params.size * 3 * 2);

        this.material = new THREE.LineDashedMaterial({
            vertexColors: THREE.VertexColors,
            // color: new THREE.Color(1, 1, 1),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true
        });

        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3).setDynamic(true));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));
        this.geometry.setDrawRange(0, 0);
        this.mesh = new THREE.LineSegments(this.geometry, this.material);
    }
    onRender(sys) {
        var vpos = 0;
        var cpos = 0;
        var totalConnections = 0;
        for (var i = 0; i < sys.ps.length; i++) {
            sys.ps[i].bag.connections = 0;
        }
        for (var i = 0; i < sys.ps.length && totalConnections < this.params.size; i++) {
            let c = sys.ps[i];
            if (c._dead) continue;
            for (var j = i + 1; j < sys.ps.length && totalConnections < this.params.size; j++) {
                let d = sys.ps[j];
                if (d._dead) continue;
                if (c.bag.connections > this.params.maxPerNode ||
                    d.bag.connections > this.params.maxPerNode) {
                    break;
                }
                if (this.params.distSq > 0) {
                    let dist = glmat.vec3.sqrDist(c.p, d.p);
                    if (dist > this.params.distSq) {
                        continue;
                    }
                }
                c.bag.connections++;
                d.bag.connections++;
                totalConnections++;

                this.positions[vpos++] = c.p[0];
                this.positions[vpos++] = c.p[1];
                this.positions[vpos++] = c.p[2];
                this.positions[vpos++] = d.p[0];
                this.positions[vpos++] = d.p[1];
                this.positions[vpos++] = d.p[2];

                // var a = 1 - dist / this.params.distSq;
                // var alpha = new THREE.Color(a, a, a);

                this.colors[cpos++] =
                    this.colors[cpos++] =
                    this.colors[cpos++] =
                    this.colors[cpos++] =
                    this.colors[cpos++] =
                    this.colors[cpos++] = 0.1;
            }
        }
        // console.log(this.positions)
        // this.geometry.verticesNeedUpdate =
        //     this.geometry.colorsNeedUpdate = true;
        this.geometry.setDrawRange(0, totalConnections * 2);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        // this.a *= 0.93;
        // this.a = this.a < 0.001 ? 0.001 : this.a;
    }
}

export class pDragLineRenderer extends pRenderer {
    constructor(params) {
        super(params);
        params.size = params.size || 0;

        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(params.size * 3 * 2);
        this.colors = new Float32Array(params.size * 3 * 2);

        this.material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            // color: new THREE.Color(1, 1, 1),
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3).setDynamic(true));
        this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3).setDynamic(true));
        this.geometry.setDrawRange(0, 0);
        this.mesh = new THREE.LineSegments(this.geometry, this.material);
    }
    onRender(sys) {
        var vpos = 0;
        var cpos = 0;
        var totalConnections = 0;
        for (var i = 0; i < sys.ps.length && totalConnections < this.params.size; i += 1) {
            let c = sys.ps[i];
            if (c._dead) continue;
            totalConnections++;
            this.positions[vpos++] = c.p[0];
            this.positions[vpos++] = c.p[1] - 0.1;
            this.positions[vpos++] = c.p[2];
            this.positions[vpos++] = c.p[0];
            this.positions[vpos++] = c.p[1] - 0.1 - c.v[1] * 10;
            this.positions[vpos++] = c.p[2];


            this.colors[cpos++] = 1;
            this.colors[cpos++] = 1;
            this.colors[cpos++] = 1;
            this.colors[cpos++] = 0
            this.colors[cpos++] = 0
            this.colors[cpos++] = 0;
        }
        // console.log(this.positions)
        // this.geometry.verticesNeedUpdate =
        //     this.geometry.colorsNeedUpdate = true;
        this.geometry.setDrawRange(0, totalConnections * 2);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        // this.a *= 0.93;
        // this.a = this.a < 0.001 ? 0.001 : this.a;
    }
}

export class pTargetBehavior extends pBehavior {

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
        canvas.height = 850;
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 850, 850);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 180px PingFang SC";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, 850 / 2, 850 / 2);

        this.target = [];
        this.targetColor = [];
        var q = 0;
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (var x = 0; x < canvas.width; x += 1) {
            for (var y = 0; y < canvas.height; y += 1) {
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

        // pt.v[0] *= 0.98;
        // pt.v[1] *= 0.98;
        // pt.v[2] *= 0.98;

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

export class pNoiseBehavior extends pBehavior {
    constructor(params) {
        super(params);
        params.power = params.power || 0.1;
    }
    onInit(pt, i) {
    }
    onUpdate(pt, i, t) {
        pt.bag.seed = pt.bag.seed || [
            pt.p[0],
            pt.p[1],
            pt.p[2]
        ];
        // pt.v[0] += noise.perlin3(pt.bag.seed[0] * 10, pt.bag.seed[1] / 10, Shared.t) * .3;
        var z = noise.perlin3(pt.bag.seed[2] / 100, pt.bag.seed[0] / 100, pt.bag.seed[1] / 100 + Shared.t / 15);
        pt.p[2] = pt.bag.seed[2] + z * this.params.power * 1;
        // pt.v[2] += noise.perlin3(pt.bag.seed[2] * 10, pt.bag.seed[0] / 10, Shared.t) * .3;
        // pt.v[1] = Math.sin(-pt.p[2] / 30 + Shared.t) * this.params.power * 3 + Math.sin(-pt.p[0] / 30 + Shared.t * 2) * this.params.power * 2;
        pt.p[1] = pt.bag.seed[1] + noise.perlin3(pt.bag.seed[1] / 50, pt.bag.seed[0] / 100 + Shared.t / 2.5, pt.bag.seed[2] / 100 - Shared.t / 3) * this.params.power;

        pt.c[2] = (z + 1.0) / 2;
        pt.c[0] = pt.c[1] = 1;


    }
}

export class pRandomBehavior extends pBehavior {
    constructor(params) {
        super(params);
        params.power = params.power || 100;
    }
    onInit(pt, i) {
    }
    onUpdate(pt, i, t) {
        pt.a[0] += (Math.random() - 0.5) * this.params.power;
        pt.a[1] += (Math.random() - 0.5) * this.params.power;
        pt.a[2] += (Math.random() - 0.5) * this.params.power;
    }
}

export class pDampingBehavior extends pBehavior {
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

export class pBlinkBehavior extends pBehavior {
    constructor(params) {
        super(params);
    }

    onUpdate(pt, i, t) {
        var a = Math.sin((i / 100 + Shared.t * 10));
        pt.c[0] = pt.c[1] = pt.c[2] = a * a * 0.8;
        if (pt.p[2] > 10 && pt.p[2] < 85) {
            // pt.c[1] = pt.c[2] = 1;
            // pt.c[0] = 1;

        }
    }
}

export class pFadeBehavior extends pBehavior {
    constructor(params) {
        super(params);
        params.speed = params.speed || 0.1;
        params.phase = params.phase || "in";
        params.curve = 2;
    }
    onUpdate(pt, i, t) {
        if (this.params.phase == "in") {
            if (pt.alpha < 1.0) {
                pt.alpha += (1 - pt.alpha) * this.params.speed;
            }
        } else if (this.params.phase == "out") {
            if (pt.alpha > 0) {
                pt.alpha -= (pt.alpha) * this.params.speed;
            }
        } else if (this.params.phase == "life") {
                pt.alpha = 1 - Math.pow(2 * pt.l - 1, this.params.curve);
        }
    }
}

export class pGravityBehavior extends pBehavior {
    constructor(params) {
        super(params);
        params.point = params.point || [0, 0, -300];
        params.g = params.g || 100.0;
        params.clamp = params.clamp || 0.05;
    }
    onUpdate(pt, i, t) {
        glmat.vec3.sub(pt.a, pt.p, pt.bag.attractor || this.params.point);
        var rd = 1 / Math.max(1, glmat.vec3.squaredLength(pt.a));
        pt.a = glmat.vec3.scale(pt.a,
            glmat.vec3.normalize(pt.a, pt.a),
            -Math.min(this.params.g * rd, this.params.clamp)
        );
    }
}