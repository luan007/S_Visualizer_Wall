import { Renderable, DOMRenderable, SlideEase } from "../base.js"
import { ease, remap } from "../ease.js";
import "./gui.less";
import "../fx/perlin.js";

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
        this.text = t.text;
        this._implode_pending = true;
    }

    out() {
        if (this.cacheState == false) return;
        if (this.domElement.hasClass("show")) {
            this.cacheState = false;
            this._implode_pending = false;
            this.transition = true;
            this.domElement.removeClass("show");
        } else {
            this.isVisible = false;
            this.transition = false;
        }
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


export class AnyBlock extends DOMRenderable {
    constructor() {
        super();

        this._implode_pending = false;

        this.cacheState = false;
        this.isVisible = false;
        this.transition = false;
        this.data = undefined;

        this.domElement = $(
            `<div></div>`
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
    }

    in(t) {
        if (this.cacheState == true) return;
        this.cacheState = true;
        this.data = t;
        this._implode_pending = true;
    }

    out() {
        if (this.cacheState == false) return;
        if (this.domElement.hasClass("show")) {
            this.cacheState = false;
            this._implode_pending = false;
            this.transition = true;
            this.domElement.removeClass("show");
        } else {
            this.isVisible = false;
            this.transition = false;
        }
    }

    _generateDom() {
        //reset!
        for (var i = 0; i < this.domElement.children().length; i++) {
            this.domElement.children()[i].remove();
            i--;
        }
        this.generateDom();
        setTimeout(() => {
            this.domElement.addClass("show");
            this.transition = true;
        }, 100);
    }

    generateDom() {
        //TBD
    }

    render() {

        if (Shared.implode && this._implode_pending) {
            this._implode_pending = false;
            this._generateDom();
        }
    }
}


export class Numbers extends AnyBlock {
    constructor() {
        super();
        this.domElement.addClass("number-blocks");
    }

    generateDom() {
        if (!this.data) return;
        for (var i = 0; i < this.data.numbers.length; i++) {
            var d = this.data.numbers[i];
            let elem = $(`
            <div class='block'>
                <span class='odometer block-value' data-value='${d[1]}'>0</span> <span> ${d[2]}</span>
                <div class='block-title'>${d[0]}</div>
            </div>
            `);

            var od = new Odometer({
                el: elem.find(".odometer")[0],
                value: 0,
                format: '(d).dd',
            });

            this.domElement.append(elem);
        }

        setTimeout(() => {
            $(".block-value").each((i, e) => {
                $(e).text(e.attributes.getNamedItem("data-value").value);
            });
        }, 1500);
    }
}


function loadImg(url) {
    var img = new Image();
    img.src = url;
    return img;
}

export function update() {
    root.update();
    ctx.clearRect(0, 0, 3240, 960);
    ctx.save();
    var step = 40;
    ctx.strokeStyle = `#fff`; //TTYL
    ctx.fillStyle = `#fff`; //TTYL
    ctx.lineWidth = 2;
    ctx.translate(step / 2, step / 2);
    for (var x = 0; x < 3240; x += step) {
        for (var y = 0; y < 960; y += step) {
            let jibu = 255; // Math.floor((Math.sin(x / 1000 + Shared.t * 10) * 0.5 + 1) * 255);
            let jibu2 = Math.pow(Math.abs(noise.perlin3(x / 50, -y / 1559 - Shared.t * 0.3, Shared.t * 1.2)), 1) *
                Shared.timeline.at(9, 1, Shared.timeline.EasingFunctions.easeOutQuad, 0.8, 0.05) *
                Shared.timeline.at(6, 3, Shared.timeline.EasingFunctions.easeOutQuad, 0, 0.8);

            let cq = false;
            for (var i = 0; i < Shared.posX.length; i++) {
                var dist = 1 - Math.min(1, Math.pow((x - Shared.posX[i].get()) / 200, 2));
                if (dist > 0) {
                    jibu2 *= (dist * 10 + 1);
                    cq = true;
                    continue;
                }
            }

            if (jibu2 < 0.005) continue;
            let nts = Math.floor(Math.abs(noise.perlin3(x / 290, y / 299, Shared.t / Shared.timeline.at(0, 1, Shared.timeline.EasingFunctions.easeInOutQuad, 1, 10))) * imgList.length);
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(0.7, 0.7);
            ctx.globalAlpha = jibu2;
            ctx.drawImage(this.imgList[nts], - step / 2, - step / 2, step - 2, step - 2)
            if (cq) {
                ctx.strokeRect(- step / 2, - step / 2, step - 2, step - 2)
            }

            ctx.globalAlpha = Math.random() * Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.easeOutQuad, 0.1, 0);
            ctx.fillRect(- step / 2 + 3, - step / 2 + 3, step - 2 - 3, step - 2 - 3);

            // ctx.fillRect();
            ctx.restore();
        }
    }

    ctx.restore();
}

export class AvatarWall extends Renderable {
    constructor() {
        super();
        this.opacity = { value: 0, target: 0, ease: 0.01 };

        this.isVisible = false;
        this.opacity.target = 0;
        
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("suite-canvas");
        this.canvas.id = "bgcanvas";

        document.body.insertBefore(this.canvas, document.querySelector("#maincanvas"));

        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 3240;
        this.canvas.height = 960;

        this.imgList = [];

        for (var i = 1; i < 200; i++) {
            this.imgList.push(loadImg("/assets/avatars/f/f" + i + ".jpg"));
            this.imgList.push(loadImg("/assets/avatars/m/m" + i + ".jpg"));
        }
    }

    in(data) {
        this.isVisible = true;
        this.opacity.target = 1;
    }

    out() {
        this.isVisible = false;
        this.opacity.target = 0;
    }

    render() {
        ease(this.opacity);

        var ctx = this.ctx;
        ctx.clearRect(0, 0, 3240, 960);
        ctx.save();
        var step = 40;
        ctx.strokeStyle = `#fff`; //TTYL
        ctx.fillStyle = `#fff`; //TTYL
        ctx.lineWidth = 2;
        ctx.translate(step / 2, step / 2);
        for (var x = 0; x < 3240; x += step) {
            for (var y = 0; y < 960; y += step) {
                let jibu = 255; // Math.floor((Math.sin(x / 1000 + Shared.t * 10) * 0.5 + 1) * 255);
                let jibu2 = Math.pow(Math.abs(noise.perlin3(x / 50, -y / 1559 - Shared.t * 0.3, Shared.t * 1.2)), 1) * 0.5;
                    // Shared.timeline.at(9, 1, Shared.timeline.EasingFunctions.easeOutQuad, 0.8, 0.05) *
                    // Shared.timeline.at(6, 3, Shared.timeline.EasingFunctions.easeOutQuad, 0, 0.8);
    
                for (var i = 0; i < Shared.posX.length; i++) {
                    var dist = 1 - Math.min(1, Math.pow((x - Shared.posX[i].get()) / 200, 2));
                    if (dist > 0) {
                        jibu2 *= (dist * 10 + 1);
                        continue;
                    }
                }
    
                if (jibu2 < 0.5) continue;
                let nts = Math.floor(Math.abs(noise.perlin3(x / 290, y / 299, Shared.t / 10)) * this.imgList.length);
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(0.7, 0.7);
                ctx.globalAlpha = jibu2 * this.opacity.value;
                ctx.drawImage(this.imgList[nts], - step / 2, - step / 2, step - 2, step - 2)
    
                // ctx.fillRect();
                ctx.restore();
            }
        }
    
        ctx.restore();
    }
}