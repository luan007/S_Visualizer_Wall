import {
    pMoveBehavior, pPointsRenderer, pLinesRenderer, pDragLineRenderer,
    pTargetBehavior, pBlinkBehavior, pFadeBehavior, pDampingBehavior,
    pGravityBehavior, pNoiseBehavior
} from "./particle-modules.js";
import { pSys, pBehavior } from "./particles.js";
import { THREERenderable, BuildRenderable } from "../base.js";
import * as THREE from "three";
import { Shared } from "../base.js";
import * as glmat from "gl-matrix";
import "./perlin.js";



export var Scene = new THREERenderable();
var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 0.2 });
target.generateDemoTarget("北京721双闪车队");


var MainSystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
    var render = new pPointsRenderer({ size: 20000, enabled: true });
    render.material.size = 4;
    var sys = new pSys(20000,
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
        for (var i = 0; i < 20000 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = Infinity;
                pt.p = [0, 0, 0];
                pt.c = [1, 1, 1];
                pt.v = [0.2 * (Math.random() - 0.5), 0.2 * (Math.random() - 0.5), 0.2 * (Math.random() - 0.5)];
            });
        }
        sys.update(1);
        sys.render();
    };
})//.addTo(Scene);

var SecondarySystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
    var blink = new pBlinkBehavior({ enabled: true });
    // var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 0.2 });
    // target.generateDemoTarget("北京721双闪车队");
    var render = new pPointsRenderer({ size: 18000, enabled: true });
    render.material.map = THREE.ImageUtils.loadTexture("./assets/Dot.png");
    var sys = new pSys(18000,
        [
            velocity,
            damp,
            position,
            // blink
        ],
        [
            render,
            // linerender
        ]);

    render.material.sizeAttenuation = false;
    render.material.size = 4;
    group.add(render.mesh);
    return () => {
        for (var i = 0; i < 4000 && i < sys.seek(); i++) {
            sys.emit((pt) => {
                pt.l = Infinity;
                pt.p = [0, 0, 500];
                pt.c = [0.2, 0.2, 0.2];
                pt.v = [4 * (Math.random() - 0.5), 4 * (Math.random() - 0.5), 5 * (Math.random() - 0.3)];
            });
        }

        sys.update(1);
        sys.render();
    };
})//.addTo(Scene);

var FloatSystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var damp = new pDampingBehavior({ enabled: true, power: 0.99 });
    var blink = new pBlinkBehavior({ enabled: true });
    var noise = new pNoiseBehavior({ enabled: true, power: 0.001 });
    var fade = new pFadeBehavior({ enabled: true, speed: 0.04 });
    // var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 0.2 });
    // target.generateDemoTarget("北京721双闪车队");
    var render = new pPointsRenderer({ size: 430, enabled: true });
    var lines = new pDragLineRenderer({ size: 430, enabled: true });
    var sys = new pSys(430,
        [
            // noise,
            velocity,
            damp,
            position,
            fade
        ],
        [
            render,
            // lines
        ]);

    render.material.sizeAttenuation = true;
    render.material.size = 2.5;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/hash_l.png");
    group.add(render.mesh);
    // group.add(lines.mesh);
    return () => {

        if (Shared.t > 1.2) {
            for (var i = 0; i < 30; i++) {
                sys.emit((pt) => {
                    pt.l = Infinity;
                    pt.alpha = 0;
                    pt.p = [(Math.random() - 0.5) * 150, -30, 350 + Math.random() * 100];
                    pt.c = [Math.random() * 0.3 + 0.7, 0.5 * Math.random(), 0, 2];
                    pt.v = [0, (Math.random() + .1) * 0.3, 0];
                });
            }
        }
        sys.update(1);
        sys.render();
    };
})//.addTo(Scene);

var WaveSystem = BuildRenderable((group) => {
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var noise = new pNoiseBehavior({ enabled: true, power: 15 });
    var damp = new pDampingBehavior({ enabled: true, power: 0.4 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var gravity = new pGravityBehavior({ enabled: true });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, speed: 0.01 });
    var render = new pPointsRenderer({ size: 30000, enabled: true });
    var sys = new pSys(30000,
        [
            // gravity,
            velocity,
            damp,
            noise,
            position,
            fade,
            // blink
        ],
        [
            render
        ]);

    for (var i = 0; i < 30000 && i < sys.seek(); i++) {
        sys.emit((pt) => {
            pt.l = Infinity;
            let deg = Math.random() * Math.PI * 2;
            let r = Math.random();

            //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
            // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
            pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
            pt.c = [0.1, 0.1, 0.1];
            pt.v = [0, 0, 0];
            pt.alpha = 0;
        });
    }
    render.material.sizeAttenuation = true;
    render.material.size = 2;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {
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
    var geometry = new THREE.TetrahedronGeometry(3, 2);
    var material = new THREE.MeshPhysicalMaterial({
        // transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(0, 0, 0),
        reflectivity: 1,
        refractionRatio: 0,
        shading: THREE.FlatShading,
        roughness: 0.5,
        // roughnessMap: THREE.ImageUtils.loadTexture("/assets/Textures/bricks1.png"),
        metalness: 1,
        // metalnessMap: THREE.ImageUtils.loadTexture("/assets/Textures/bricks1.png"),
        // emissiveMap: THREE.ImageUtils.loadTexture("/assets/Textures/crystal1.png"),
        // emissive: new THREE.Color(0.1, 0.3, 1),
        // emissiveIntensity: 1,
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

    var disk = new THREE.RingGeometry(12.2, 13, 50, 50);
    var diskMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        // wireframe: true,
        color: new THREE.Color(0.3, 0.1, 0),
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



    // var CrystalSystem = BuildRenderable((_g) => {
    //     var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    //     var damp = new pDampingBehavior({ enabled: true, power: 0.9 });
    //     var position = new pMoveBehavior({ enabled: true, stage: "position" });
    //     var gravity = new pGravityBehavior({ enabled: true, g: 100000, clamp: 0.05 });
    //     var noise = new pNoiseBehavior({ enabled: true, power: 1 });
    //     var render = new pPointsRenderer({ size: 3000, enabled: true });
    //     var sys = new pSys(3000,
    //         [
    //             //noise,
    //             gravity,
    //             velocity,
    //             // damp,
    //             position,
    //         ],
    //         [
    //             render
    //         ]);

    //     render.material.sizeAttenuation = true;
    //     render.material.size = 5;
    //     render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    //     _g.add(render.mesh);
    //     return () => {
    //         for (var i = 0; i < 100 && i < sys.seek(); i++) {
    //             sys.emit((pt) => {
    //                 pt.l = 100;
    //                 pt.p = [group.position.x, group.position.y, group.position.z];
    //                 pt.c = [1.0, 0, 0];
    //                 pt.v = [0, 0, 0];
    //                 pt.alpha = 1;
    //                 pt.bag.attractor = target.target[Math.floor(Math.random() * target.target.length)];
    //             });
    //         }
    //         sys.update(1);
    //         sys.render();
    //     };
    // }).addTo(Scene);


    return (t) => {
        for (var i = 0; i < geometry.vertices.length; i++) {
            let q = Math.floor(noise.perlin3(i / 3, seed, Shared.t * 2) * 3) / 3;
            var norm = geometry.vertices[i].normalize();
            var n = norm.clone();
            norm.multiplyScalar(q * 2 + 5);
            // geometry.vertices[i].normalize().multiplyScalar(q * 5 + 10);
            var c = n.clone().multiplyScalar(q * 6 + 10);
            var s = n.clone().multiplyScalar((Math.random() - 0.5) * 1);

            for (var j = 1; j < morph.length; j++) {
                morph[j].vertices[i].x = norm.x * 1.5;
                morph[j].vertices[i].y = norm.y * 1.5;
                morph[j].vertices[i].z = norm.z * 1.5;
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


var _tmp_Objs = (group) => {

    var all = [];
    var local = new THREE.Group();
    group.add(local);
    var seed = Math.random() * 150;
    var material = new THREE.MeshPhysicalMaterial({
        // transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1.0, 0.5, 0),
        reflectivity: 1,
        shading: THREE.FlatShading,
        roughness: 0,
        metalness: 1,
        envMap: cube,
        envMapIntensity: 1,
        // emissive: new THREE.Color(0.01, 0.01, 0.01)

    });
    for (var i = 0; i < 150; i++) {
        var geometry = new THREE.TetrahedronGeometry(3, 1);
        var mesh = new THREE.Mesh(geometry, material);
        all.push(mesh)

        mesh.translateX((Math.random() - 0.5) * 1455);
        mesh.translateY((Math.random() - 0.5) * 1455);
        mesh.translateZ((Math.random() - 0.5) * 500 - 400);
        local.add(mesh);
    }


    return (t) => {
        for (var i = 0; i < all.length; i++) {
            all[i].geometry.rotateX(0.01);
            all[i].geometry.rotateY(0.005);
        }
    };
};


// BuildRenderable(_tmp_Objs).addTo(Scene);
// BuildRenderable(_tmp_Crystal).addTo(Scene);
// BuildRenderable(_tmp_Crystal).addTo(Scene);
// BuildRenderable(_tmp_Crystal).addTo(Scene);




