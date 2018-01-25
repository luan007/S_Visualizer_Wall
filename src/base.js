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
        if (!(parent instanceof Base)) throw new Error('parent is not typed of Base');
        if (parent === this) throw new Error('parent cannot be itself');
        if (this._parent) throw new Error('parent has been set');
        this._parent = parent;
        this._parent.children.push(this);
        // this._parent.group.add(this.group);
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
        this.group.add(parent.group);
    }
    destroy() {
        this.parent.group.remove(this.group);
        super.destroy();
    }
    setEnabled(e) {
        super.setEnabled(e);
        this.group.visible = e;
    }
}