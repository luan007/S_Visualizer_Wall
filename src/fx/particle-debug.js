import { pMoveBehavior, pPointsRenderer, pLinesRenderer } from "./particle-modules.js";
import { pSys, pBehavior } from "./particles.js";
import { THREERenderable, BuildRenderable } from "../base.js";
import * as THREE from "three";
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
    var render = new pPointsRenderer({ size: 8000, enabled: true });
    var linerender = new pLinesRenderer({ size: 8000, enabled: true });
    var sys = new pSys(8000,
        [
            velocity,
            damp,
            position,
            // blink
        ],
        [
            render,
            linerender
        ]);

    for (var i = 0; i < 18000 && i < sys.seek(); i++) {
        sys.emit((pt) => {
            pt.l = Infinity;
            pt.p = [0, 0, 0];
            pt.c = [0.5, 0.5, 0.5];
            pt.v = [4 * (Math.random() - 0.5), 4 * (Math.random() - 0.5), 15 * (Math.random() - 0.3)];
        });
    }
    render.material.sizeAttenuation = true;
    render.material.size = 0.8;
    group.add(render.mesh);
    group.add(linerender.mesh);
    return () => {
        sys.update(1);
        sys.render();
    };
}).addTo(Scene);

var WaveSystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.98 });
    var blink = new pBlinkBehavior({ enabled: true });
    // var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 0.2 });
    // target.generateDemoTarget("北京721双闪车队");
    var render = new pPointsRenderer({ size: 300, enabled: true });
    var sys = new pSys(300,
        [
            velocity,
            damp,
            position,
            blink
        ],
        [
            render
        ]);

    render.material.sizeAttenuation = true;
    render.material.size = 10;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/DotFlat.png");
    group.add(render.mesh);
    return () => {
        for (var i = 0; i < 2 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = Infinity;
                pt.p = [(Math.random() - 0.5) * 650, -120, Math.random() * 300 + 100];
                pt.c = [1, 1, 1];
                pt.v = [0, (Math.random() + .1) * 4, 0];
            });
        }

        sys.update(1);
        sys.render();
    };
}).addTo(Scene);


var cube = THREE.ImageUtils.loadTextureCube([
    '/assets/Env/space/px.png',
    '/assets/Env/space/nx.png',
    '/assets/Env/space/py.png',
    '/assets/Env/space/ny.png',
    '/assets/Env/space/pz.png',
    '/assets/Env/space/nz.png',
], THREE.CubeReflectionMapping);


var _tmp_Crystal = (group) => {

    var morph = [];

    var local = new THREE.Group();
    group.add(local);
    var seed = Math.random() * 150;
    var geometry = new THREE.TetrahedronGeometry(7, 2);
    var material = new THREE.MeshPhysicalMaterial({
        // transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 0.1, 0.01),
        reflectivity: 1,
        refractionRatio: 0,
        shading: THREE.FlatShading,
        roughness: 0.5,
        // roughnessMap: THREE.ImageUtils.loadTexture("/assets/Textures/bricks1.png"),
        metalness: 1,
        // metalnessMap: THREE.ImageUtils.loadTexture("/assets/Textures/bricks1.png"),
        emissiveMap: THREE.ImageUtils.loadTexture("/assets/Textures/crystal1.png"),
        emissive: new THREE.Color(0.1, 0.3, 1),
        emissiveIntensity: 1,
        // blending: THREE.AdditiveBlending,
        // refractionRatio: 0.8,
        // clearCoatRoughness: 0,
        // clearCoat: 1,
        envMap: cube,
        envMapIntensity: 1,
        clearCoatRoughness: 0,
        clearCoat: 1
        // opacity: 0.8
        // opacity: 0.5
    });

    var mesh = new THREE.Mesh(geometry, material);
    local.add(mesh);

    morph.push(geometry);

    for (var i = 0; i < 8; i += 3) {
        var wfGeometry = geometry.clone();
        var wfMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: true,
            color: new THREE.Color(1.0, 0.5, 0.1),
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        var wf = new THREE.Mesh(wfGeometry, wfMaterial);
        local.add(wf);
        morph.push(wfGeometry);
    }

    var disk = new THREE.RingGeometry(18.2, 19, 50, 50);
    var diskMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        // wireframe: true,
        color: new THREE.Color(1.0, 0.5, 0),
    });
    var diskMesh = new THREE.Mesh(disk, diskMat);
    group.add(diskMesh);

    group.translateX(290 * (Math.random() - 0.5));
    group.translateY(50 * (Math.random() - 0.5));
    group.translateZ(300 - Math.random() * 300);

    var domElement = $(`
        <div style="position: fixed; top: 0px; left: 0px; text-align: right; transform: translate(722.586px, 286.145px);">
            <div style="font-family: 'DIN'; font-weight: 600;font-size: 2vw;color: white;padding: 0.5vh 2vh 1vh 2vh;background: #ff162b85;">319,381,382</div>
            <div style="font-family: 'PingFang SC' ;font-weight: 200;opacity: 1;font-size: 0.7vw;color: white;margin-top: 6px;">/ 参与用户</div>
        </div>
    `).appendTo(document.body);

    return (t) => {
        for (var i = 0; i < geometry.vertices.length; i++) {
            let q = Math.floor(noise.perlin3(i / 3, seed, Shared.t * 2) * 3) / 3;
            var norm = geometry.vertices[i].normalize();
            var n = norm.clone();
            norm.multiplyScalar(q * 5 + 10);
            // geometry.vertices[i].normalize().multiplyScalar(q * 5 + 10);
            var c = n.clone().multiplyScalar(q * 6 + 10);
            var s = n.clone().multiplyScalar((Math.random() - 0.5) * 1);

            for (var j = 1; j < morph.length; j++) {
                morph[j].vertices[i].x = norm.x;
                morph[j].vertices[i].y = norm.y;
                morph[j].vertices[i].z = norm.z;
            }
        }
        geometry.verticesNeedUpdate = true;

        for (var j = 1; j < morph.length; j++) {
            morph[j].verticesNeedUpdate = true;
        }

        local.rotateX(0.01);
        local.rotateY(0.01);


        var vector = group.position.clone().project(Shared.camera);
        vector.x = (vector.x + 1) / 2 * Shared.w;
        vector.y = -(vector.y - 1) / 2 * Shared.h;

        domElement.css("transform", `translate(${vector.x}px, ${vector.y}px)`);

    };
};

BuildRenderable(_tmp_Crystal).addTo(Scene);
// BuildRenderable(_tmp_Crystal).addTo(Scene);
// BuildRenderable(_tmp_Crystal).addTo(Scene);
// BuildRenderable(_tmp_Crystal).addTo(Scene);