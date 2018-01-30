//structure
import * as THREE from 'three';



export class Renderable {
    constructor(childrens) {
        // this.group = new THREE.Group();
        this.children = [];
        this._markRemoval = false;
        this._childrenDirty = false;
        this._parent = null;
        this._enabled = true;
        this._render = () => { };
        if (childrens && Array.isArray(childrens)) {
            childrens.forEach(element => {
                this.add(element);
            });
        }
    }
    addTo(parent) {
        if (!(parent instanceof Renderable)) throw new Error('type mismatch');
        if (parent === this) throw new Error('parent cannot be itself');
        if (this._parent) throw new Error('parent has been set');
        this._parent = parent;
        this._parent.children.push(this);
        // this._parent.group.add(this.group);
        return this;
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
        (parent.group && this.group) && parent.group.add(this.group);
    }
    add(obj) {
        super.add(obj);
        (obj.group && this.group) && this.group.add(obj.group);
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

export class DOMRenderable extends Renderable {
    constructor(_render) {
        super(_render);
        this.domElement = null;
    }
    addTo(parent) {
        (this.domElement && parent.domElement) && parent.domElement.append(this.domElement);
        super.addTo(parent);
    }
    add(obj) {
        (obj.domElement && this.domElement) && this.domElement.append(obj.domElement);
        super.add(obj);
    }
    destroy() {
        (this.domElement && parent.domElement) && this.parent.domElement.remove(this.domElement);
        super.destroy();
    }
    setEnabled(e) {
        super.setEnabled(e);
    }
}

export function BuildRenderable(construction) {
    var renderable = new THREERenderable();
    var _render = construction(renderable.group, renderable);
    renderable._render = _render;
    return renderable;
}

export function map(t, a, b, c, d) {
    return ((t - a) / (b - a)) * (d - c) + c;
}

export class Timer extends Renderable {
    constructor() {
        super();
        this.t = 0;
        this.offset = 0;
        this.running = false;
        this.EasingFunctions = {
            // no easing, no acceleration
            linear: function (t) { return t },
            // accelerating from zero velocity
            easeInQuad: function (t) { return t * t },
            // decelerating to zero velocity
            easeOutQuad: function (t) { return t * (2 - t) },
            // acceleration until halfway, then deceleration
            easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
            // accelerating from zero velocity 
            easeInCubic: function (t) { return t * t * t },
            // decelerating to zero velocity 
            easeOutCubic: function (t) { return (--t) * t * t + 1 },
            // acceleration until halfway, then deceleration 
            easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
            // accelerating from zero velocity 
            easeInQuart: function (t) { return t * t * t * t },
            // decelerating to zero velocity 
            easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
            // acceleration until halfway, then deceleration
            easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
            // accelerating from zero velocity
            easeInQuint: function (t) { return t * t * t * t * t },
            // decelerating to zero velocity
            easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
            // acceleration until halfway, then deceleration 
            easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
        }
    }

    start(offset) {
        offset = offset || 0;
        this.running = true;
        this.offset = offset;
        this.init = Date.now();
    }

    setOffset(offset) {
        this.offset = offset;
    }

    stop() {
        this.running = false;
    }

    at(offset, duration, ease, from, to) {
        ease = ease || this.EasingFunctions.easeInOutQuad;
        var t = Math.min(1, Math.max(0, this.t - offset) / duration);
        if (from !== undefined && to !== undefined) {
            t = map(t, 0, 1, from, to);
        }
        return ease(t);
    }

    p(tfrom, tto, ease, from, to) {
        return atob(tfrom, tto - tfrom, ease, from, to);
    }

    update(data) {
        super.update();
        if (this.running) {
            this.t = (Date.now() - this.init) / 1000.0 + this.offset;
        }
    }
}

export class SlideEase extends Renderable {
    constructor() {
        super();
        this.v = 0;
        this.target = 0;
        this.factor = 0.05;
    }

    power(f) {
        this.factor = f;
    }

    set(t) {
        this.target = t;
    }

    get() {
        return this.v;
    }

    update(data) {
        super.update();
        this.v += (this.target - this.v) * this.factor;
    }
}


export class SceneControl extends Renderable {

    constructor(e) {
        super(e);
        this.sceneId = -1;
        this.nextSceneId = 0;
        this.stage = false;
        this.stageMatch = false;
        this.nextStage = undefined;
        this.data = [1,2,3];
        this.managed = [];
        this.autoManage = true;
    }

    _visible() {
        if (this.data[this.sceneId]) {
            this.nextStage = true;
            for (var i = 0; i < this.managed.length; i++) {
                this.managed[i].in(this.data[this.sceneId]);
            }
        }
    }
    _collapse() {
        this.nextStage = false;
        for (var i = 0; i < this.managed.length; i++) {
            this.managed[i].out();
        }
    }

    setScene(s) {
        if (s !== this.sceneId && s !== this.nextSceneId) {
            this.nextSceneId = s;
            if (this.autoManage) {
                this._collapse();
            }
        }
    }

    render() {
        //stage match calc
        this.stageMatch = true;
        if (this.nextStage !== undefined) {
            for (var i = 0; i < this.managed.length; i++) {
                if (this.managed[i].isVisible !== this.nextStage || this.managed[i].transition) {
                    this.stageMatch = false;
                    break;
                }
            }
        }
        if (this.nextStage !== undefined && this.stageMatch) {
            this.stage = this.nextStage;
            this.nextStage = undefined;
        }

        if (this.autoManage) {
            if (!this.stageMatch && this.nextStage !== undefined) {
                this.nextStage ? this._visible() : this._collapse();
            }

            if (this.nextSceneId == undefined
                && this.stage == false &&
                this.stageMatch == true) {
                this._visible();
            }

            //only switch when dark
            if (this.nextSceneId !== undefined && this.nextSceneId != this.sceneId && this.stageMatch && this.stage == false) {
                this.sceneId = this.nextSceneId;
                this.nextSceneId = undefined;
            }
        }
    }
}