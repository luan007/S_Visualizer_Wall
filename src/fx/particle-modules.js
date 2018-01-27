import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "../base.js";
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
            size: 3,
            transparent: true,
            // opacity: 1,
            // alphaTest: 0.5,
            sizeAttenuation: false,
            map: texture,
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

export class pLinesRenderer extends pRenderer {
    constructor(params) {
        super(params);
        params.size = params.size || 0;
        params.maxPerNode = params.maxPerNode || 2;
        params.distSq = params.distSq || 500;

        this.a = 1;

        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(params.size * 3 * 2);
        this.colors = new Float32Array(params.size * 3 * 2);

        this.material = new THREE.LineBasicMaterial({
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
            for (var j = i + 1; j < sys.ps.length && totalConnections < this.params.size; j++) {
                let d = sys.ps[j];
                if (c.bag.connections > this.params.maxPerNode ||
                    d.bag.connections > this.params.maxPerNode) {
                    break;
                }
                // let dist = glmat.vec3.sqrDist(c.p, d.p);
                // if (dist > this.params.distSq) {
                //     continue;
                // }
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
                    this.colors[cpos++] = this.a;
            }
        }
        // console.log(this.positions)
        // this.geometry.verticesNeedUpdate =
        //     this.geometry.colorsNeedUpdate = true;
        this.geometry.setDrawRange(0, totalConnections * 2);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.a *= 0.93;
        this.a = this.a < 0.001 ? 0.001 : this.a;
    }
} 
