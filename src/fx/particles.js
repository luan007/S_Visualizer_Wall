import * as THREE from "three";
import { Renderable, THREERenderable, Shared, BuildRenderable } from "../base.js";

//pooled particles
class psys {
    constructor(size) {
        console.log("Initializing particle pool - Size [" + size + "]");
        this.ps = [];
        this.available = [];
        for(var i = 0; i < size; i++) {
            this.ps.push({
                p: [0, 0, 0],
                v: [0, 0, 0],
                a: [0, 0, 0],
                bag: {},
                c: [1, 1, 1, 1],
                l: 0
            });
            this.available.push(i);
        }
    }

    emit(fn) {
        if(this.available.length == 0) return false;
        var id = this.available.pop();
        var elem = this.ps[id];
        !!!fn || fn(elem);
        return elem;
    }
}