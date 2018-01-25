import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "../base.js";

class pBehavior {
    constructor(params) {
        params = params || {};
        if (params.enabled == undefined) {
            params.enabled = true;
        }
        this.pSys = undefined;
        this.params = params;
    }
    onUpdate(pt, i, t) { }
    onInit(pt, i) { }
    onEmit(pt, i) { }
}

class pMoveBehavior extends pBehavior {
    constructor(params) {
        super(params);
    }
    onUpdate(pt, i, t) {
        if (params.stage == "velocity") {
            pt.v[0] += pt.a[0] * t;
            pt.v[1] += pt.a[1] * t;
            pt.v[2] += pt.a[2] * t;
        } else if (params.stage == "position") {
            pt.p[0] += pt.v[0] * t;
            pt.p[1] += pt.v[1] * t;
            pt.p[2] += pt.v[2] * t;
        }
    }
}

class pRenderer {
    constructor(params) {
        params = params || {};
        if (params.enabled == undefined) {
            params.enabled = true;
        }
        this.pSys = undefined;
        this.params = params;
    }
    onInit() { }
    onRender() { }
}

class pPointsRenderer {
    constructor(params) {
        super(params);
    }
    onInit() { }
    onRender() { }
} 


//pooled particles
class pSys {
    constructor(size, bstack, rstack) {
        console.log("Initializing particle pool - Size [" + size + "]");
        this.ps = [];
        this.available = [];
        this.bstack = bstack;
        this.rstack = rstack;

        for (var j = 0; j < this.bstack.length; j++) {
            this.bstack[j].pSys = this;
        }
        for (var j = 0; j < this.rstack.length; j++) {
            this.rstack[j].pSys = this;
        }

        for (var i = 0; i < size; i++) {
            this.ps.push({
                p: [0, 0, 0],
                v: [0, 0, 0],
                a: [0, 0, 0],
                c: [1, 1, 1, 1],
                l: 0,
                bag: {},
                _dead: true
            });
            for (var j = 0; j < this.bstack.length; j++) {
                this.bstack[j].onInit(pt, i);
            }
            this.available.push(i);
        }

        for (var j = 0; j < this.rstack.length; j++) {
            this.rstack[j].onInit();
        }
    }

    emit(fn) {
        if (this.available.length == 0) return false;
        var id = this.available.pop();
        var elem = this.ps[id];
        elem._dead = false;
        !!!fn || fn(elem);
        for (var j = 0; j < this.bstack.length; j++) {
            if (!this.bstack[j].params.enabled) continue;
            this.bstack[j].onEmit(pt, i);
        }
        return elem;
    }

    update(t) {
        for (var i = 0; i < this.ps.length; i++) {
            var pt = this.ps[i];
            if (pt._dead) continue;
            pt.l -= t;
            if (pt.l <= 0) {
                pt._dead = true;
                this.available.push(i);
            }
            for (var j = 0; j < this.bstack.length; j++) {
                if (!this.bstack[j].params.enabled) continue;
                this.bstack[j].onUpdate(pt, i, t);
            }
        }
    }

    render() {
        for (var j = 0; j < this.rstack.length; j++) {
            if (!this.rstack[j].params.enabled) continue;
            this.rstack[j].onRender();
        }
    }
}