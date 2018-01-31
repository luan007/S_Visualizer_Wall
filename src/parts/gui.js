import { Renderable, DOMRenderable, SlideEase } from "../base.js"
import { ease, remap } from "../ease.js";
import "./gui.less";

function px(p) {
    return ((100 / 3240) * p) + "vw";
}

export class FixedContainer extends DOMRenderable {
    constructor(_render) {
        super(_render);
        this.domElement = $(`
            <div class="fixed">
            </div>
        `);
    }
}

export class Title extends DOMRenderable {
    constructor() {
        super();

        this._implode_pending = false;

        this.cacheState = false;
        this.isVisible = false;
        this.transition = false;
        this.domElement = $(
            `<div class='gui-title'></div>`
        );
        var later = 0;
        this.domElement.on("transitionend", (e) => {
            clearTimeout(later);
            later = setTimeout(() => {
                if (!this.domElement.hasClass("show")) {
                    // visible, all good
                    this.isVisible = false;
                } else {
                    this.isVisible = true;
                }
                this.transition = false;
            }, 200);
        });
        this.text = "{PLACE HOLDER}";
        this.textElements = [];
        // this.text = "{PLACE HOLDER}";
        // this.isVisible = false;
    }

    in(t) {
        if (this.cacheState == true) return;
        this.cacheState = true;
        this.text = "{SCENE #" + t + "}";
        this._implode_pending = true;
    }

    out() {
        if (this.cacheState == false) return;
        this.cacheState = false;
        this._implode_pending = false;
        this.transition = true;
        this.domElement.removeClass("show");
    }

    _generateDom() {
        //reset!
        for (var i = 0; i < this.textElements.length; i++) {
            this.textElements[i].remove();
        }
        this.textElements = [];
        for (var i = 0; i < this.text.length; i++) {
            this.textElements[i] = $(
                `<span>${this.text[i]}</span>`
            );
            this.textElements[i].appendTo(this.domElement);
        }
        setTimeout(() => {
            this.domElement.addClass("show");
            this.transition = true;
        }, 100);
    }

    render() {

        if (Shared.implode && this._implode_pending) {
            this._implode_pending = false;
            this._generateDom();
        }

        for (var i = 0; i < this.textElements.length; i++) {
            this.textElements[i].css("opacity",
                Math.sin(Shared.t * 1 * this.textElements[i].p) * 0.2 + 1);
        }
        // if (ease(this.visibility)) {
        //     for (var i = 0; i < this.textElements.length; i++) {
        //         let v = Math.pow(
        //             remap(this.visibility, this.textElements[i].delay, 1),
        //             this.textElements[i].p);
        //         this.textElements[i].css("transform", `translateZ(0) scale(${Math.sqrt(v)}, ${Math.sqrt(v)})`);
        //         this.textElements[i].css("background-position", `${Math.round(100 - (v * 100))}% ${Math.round(100 - (v * 100))}%`);
        //         this.textElements[i].css("filter", `blur(${(10 - (v * 10))}px)`);
        //         let m = px(40 * v * v);
        //         this.textElements[i].css("margin-left", m);
        //         this.textElements[i].css("margin-right", m);
        //     }
        // }
    }
}

