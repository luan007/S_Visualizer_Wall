export class pBehavior {
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

export class pRenderer {
    constructor(params) {
        params = params || {};
        if (params.enabled == undefined) {
            params.enabled = true;
        }
        this.pSys = undefined;
        this.params = params;
    }
    onInit() { }
    onRender(pSys) { }
}

//pooled particles
export class pSys {
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
                p: ([0, 0, 0]),
                v: ([0, 0, 0]),
                a: ([0, 0, 0]),
                c: ([1, 1, 1]),
                l: 0,
                m: 1,
                bag: {},
                _dead: true
            });
            for (var j = 0; j < this.bstack.length; j++) {
                this.bstack[j].onInit(this.ps[i], i);
            }
            this.available.push(i);
        }

        for (var j = 0; j < this.rstack.length; j++) {
            this.rstack[j].onInit();
        }
    }

    seek() {
        return this.available.length;
    }

    emit(fn) {
        if (this.available.length == 0) return false;
        var id = this.available.pop();
        var elem = this.ps[id];
        elem._dead = false;
        !!!fn || fn(elem);
        if(fn) {
            fn(elem);
        }
        for (var j = 0; j < this.bstack.length; j++) {
            if (!this.bstack[j].params.enabled) continue;
            this.bstack[j].onEmit(elem, id);
        }
        return elem;
    }

    update(t) {
        for (var i = 0; i < this.ps.length; i++) {
            let pt = this.ps[i];
            if (pt._dead) continue;
            pt.l -= t;
            if (pt.l <= 0) {
                pt._dead = true;
                this.available.push(i);
            }
            pt.a[0] = pt.a[1] = pt.a[2] = 0;
            for (var j = 0; j < this.bstack.length; j++) {
                if (!this.bstack[j].params.enabled) continue;
                this.bstack[j].onUpdate(pt, i, t);
            }
        }
    }

    render() {
        for (var j = 0; j < this.rstack.length; j++) {
            if (!this.rstack[j].params.enabled) continue;
            this.rstack[j].onRender(this);
        }
    }
}