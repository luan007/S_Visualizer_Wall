import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "../base.js";
import { pSys, pBehavior, pRenderer } from "./particles.js";

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

        this.material = new THREE.PointsMaterial({
            vertexColors: true,
            size: 1,
            transparent: true,
            sizeAttenuation: true,
            // depthTest: false,
            // blending: THREE.AdditiveBlending
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
            // this.geometry.vertices[i].x = c.p[0];
            // this.geometry.vertices[i].y = c.p[1];
            // this.geometry.vertices[i].z = c.p[2];

            // this.geometry.colors[i].r = c.c[0];
            // this.geometry.colors[i].g = c.c[1];
            // this.geometry.colors[i].b = c.c[2];

            this.positions[vpos++] = c.p[0];
            this.positions[vpos++] = c.p[1];
            this.positions[vpos++] = c.p[2];

            this.colors[cpos++] = c.c[0];
            this.colors[cpos++] = c.c[1];
            this.colors[cpos++] = c.c[2];

        }
        // this.geometry.verticesNeedUpdate =
        //     this.geometry.colorsNeedUpdate = true;


        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }
} 