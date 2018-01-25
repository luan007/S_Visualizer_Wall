//structure
import * as THREE from 'three';

export class Renderable {
    constructor(_render) {
        // this.group = new THREE.Group();
        this.children = [];
        this._markRemoval = false;
        this._childrenDirty = false;
        this._parent = null;
        this._enabled = true;
        this._render = _render;
    }
    addTo(parent) {
        if (!(parent instanceof Renderable)) throw new Error('type mismatch');
        if (parent === this) throw new Error('parent cannot be itself');
        if (this._parent) throw new Error('parent has been set');
        this._parent = parent;
        this._parent.children.push(this);
        // this._parent.group.add(this.group);
    }
    add(obj) {
        obj.addTo(this);
        return this;
    }
    destroy() {
        // if (!this._parent) throw new Error('instance only when has parent can use destroy');
        this._markRemoval = true;
        this._parent._childrenDirty = true;
    }
    update(data) {
        if (!this._enabled) return;
        if (this._childrenDirty) {
            this.children = this.children.filter(child => {
                if (child._markRemoval) this.group.remove(child.group);
                return !child._markRemoval;
            });
            this._childrenDirty = false;
        }
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.update(data);
        }
        this.render(data);
    }
    render(data) {
        !!this._render ? this._render() : 0;
    }
    setEnabled(e) {
        this._enabled = e;
    }
}

export class THREERenderable extends Renderable {
    constructor(_render) {
        super(_render);
        this.group = new THREE.Group();
    }
    addTo(parent) {
        super.addTo(parent);
        parent.group.add(this.group);
        console.log(parent);
    }
    destroy() {
        this.parent.group.remove(this.group);
        super.destroy();
    }
    setEnabled(e) {
        super.setEnabled(e);
        this.group.visible = e;
    }
    build(construction) {
        BuildRenderable(construction).addTo(this);
        return this;
    }
}

export function BuildRenderable(construction) {
    var renderable = new THREERenderable();
    var _render = construction(renderable.group, renderable);
    renderable._render = _render;
    return renderable;
}


//shared events
import EventEmitter from "event-emitter";
export var Events = new EventEmitter();


//shared vars
export var Shared = {
    W: 3240,
    H: 960
};