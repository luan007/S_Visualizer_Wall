import { Renderable, DOMRenderable, SlideEase } from "../base.js"
import { ease, remap } from "../ease.js";
import * as PIXI from "pixi.js";
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


export class WeiboFloater extends DOMRenderable {
    show() {
        this.domElement.addClass("show");
    }
    hide() {
        this.domElement.removeClass("show");
    }
    constructor(_render) {
        super(_render);
        this.domElement = $(`
            <div class="weibo-floater">
                <div class='scaler'>
                    <div class="at">@人民日报</div>
                    <div class="content">【你愿为他们转吗？大雪过后刷屏的不仅是雪景，还有这张让人心疼的照片[心]】这两天，南京抗击暴雪，全城7.8万人上街扫雪。这张照片摄于南京建邺区文化艺术中心小剧场，26日清晨，某舟桥旅官兵540余人，结束彻夜扫雪除冰任务后，在此休息。他们中绝大部分是90后、95后。（现代快报）网友：最可爱的人！</div>
                </div>
            </div>
        `);
        this.dom_scaler = $(this.domElement.find(".scaler")[0]);
        this.dom_at = $(this.domElement.find(".at")[0]);
        this.dom_content = $(this.domElement.find(".content")[0]);
        this.dom_content.css("max-width", px(Math.random() * 50 + 25))
        // this.domElement.css("transform", `translate(${px(Math.random() * 3240)}, ${px(960 - 40 - Math.floor(Math.random() * 360 / 40) * 40)})`);
        // this.dom_scaler.css("transform", `scale(${r}, ${r})`);
    }

    setPos(x, y, r) {
        this.domElement.css("transform", `translate(${px(x)}, ${px(y)})`);
        this.dom_scaler.css("transform", `scale(${r}, ${r})`);
    }
}

export class WeiboFloaterManager extends DOMRenderable {
    constructor(size) {
        super();
        this.domElement = $(`
            <div class="weibo-floaters show"></div>
        `);
        this.floaters = [];
        for (var i = 0; i < size; i++) {
            var floater = new WeiboFloater();
            floater.addTo(this);
            this.floaters.push(floater);
        }
    }
    in() {
        this.isVisible = true;
        this.domElement.addClass("show");
    }
    out() {
        this.isVisible = false;
        this.domElement.removeClass("show");
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
                console.log("LATER", this.isVisible);
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
        }, 300);
    }
}

class AvatarTiny extends DOMRenderable {
    constructor(_render) {
        super(_render);
        this.visible = false;
        this.prev = [];
        this.domElement = $(`
            <div class="avatar-floater">
                <div class='scaler'>
                    <div class='avatar'><img class='avatar-image' src="/assets/avatars/2.jpg"/></div>
                    <div class="at">@人民日报</div>
                    <div class="content">【你愿为他们转吗？大雪过后刷屏的不仅是雪景，还有这张让人心疼的照片[心]】这两天，南京抗击暴雪，全城7.8万人上街扫雪。这张照片摄于南京建邺区文化艺术中心小剧场，26日清晨，某舟桥旅官兵540余人，结束彻夜扫雪除冰任务后，在此休息。他们中绝大部分是90后、95后。（现代快报）网友：最可爱的人！</div>
                </div>
            </div>
        `);
        var r = Math.random() * .5 + 0.3;
        this.dom_scaler = $(this.domElement.find(".scaler")[0]);
        this.dom_at = $(this.domElement.find(".at")[0]);
        this.dom_content = $(this.domElement.find(".content")[0]);
        this.dom_avatar = $(this.domElement.find(".avatar-image")[0]);
        // this.dom_content.css("max-width", px(Math.random() * 100 + 55))
        // this.domElement.css("transform", `translate(${px(Math.random() * 3240)}, ${px(960 - 40 - Math.floor(Math.random() * 360 / 40) * 40)})`);
        // this.dom_scaler.css("transform", `scale(${r}, ${r})`);
    }
    show(x, y, url) {
        this.dom_avatar.attr("src", url);
        this.domElement.css("transform", `translate(${px(x)}, ${px(y)})`);
        if (this.prev[0] !== x || this.prev[1] !== y) {
            this.domElement.removeClass("show");
            this.prev[0] = x;
            this.prev[1] = y;
            this.visible = false;
            return;
        }
        if (!this.visible) {
            this.visible = true;
            this.domElement.addClass("show");
        }
    }
    hide() {
        if (this.visible) {
            this.visible = false;
            this.domElement.removeClass("show");
        }
    }
}

export class AvatarWall extends DOMRenderable {

    loadImg(url) {
        var img = new Image();
        img.src = url;

        var canvas = document.createElement("canvas");
        canvas.width = this.step * 0.7 - 2;
        canvas.height = this.step * 0.7 - 2;
        this.t = 0;

        img.onload = () => {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 1000, 1000);
            ctx.drawImage(img, 0, 0, this.step * 0.7 - 2, this.step * 0.7 - 2);
        };
        return canvas;
    }

    constructor() {
        super();

        this.tiny = [];
        this.domElement = $(`
            <div class="avatar-floaters"></div>
        `);
        for (var i = 0; i < Shared.posX.length; i++) {
            var avatar = new AvatarTiny();
            avatar.addTo(this);
            this.tiny.push(avatar);
        }


        this.step = 40;
        this.opacity = { value: 0, target: 0, ease: 0.01 };
        this.pulse = { value: 0, target: 0, ease: 0.1 };

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
            this.imgList.push(this.loadImg("/assets/avatars/f/f" + i + ".jpg"));
            this.imgList.push(this.loadImg("/assets/avatars/m/m" + i + ".jpg"));
        }
    }

    in(data) {
        this.isVisible = true;
        this._implode_pending = true;
    }

    out() {
        this.isVisible = false;
        this._implode_pending = false;
        this.opacity.target = 0;
    }

    render() {
        this.t += 0.01;
        if (Shared.implode && this._implode_pending) {
            this.pulse.target = 1;
            this.pulse.value = 0;
            this.opacity.target = 1;
            this._implode_pending = false;
            this.t = 0;
        }
        if (this.t < 1) {
            this.pulse.ease = 0.8;
        } else {
            this.pulse.target = 0;
            this.pulse.ease = 0.01;
        }
        ease(this.opacity);
        // return;
        var ctx = this.ctx;
        var step = this.step;
        ctx.clearRect(0, 0, 3240, 960);
        ctx.save();
        ctx.strokeStyle = `#fff`; //TTYL
        ctx.fillStyle = `#fff`; //TTYL
        ctx.lineWidth = 2;
        ctx.translate(step / 2, step / 2);
        for (var x = 0; x < 3240; x += step) {
            for (var y = 0; y < 960; y += step) {
                let jibu = 255;
                let jibu2 = Math.abs(noise.perlin3(x / 30, -y / 1559 - Shared.t * 0.3, Shared.t * 1.2)) * 0.3 * (1 + this.pulse.value);
               
                for (var i = 0; i < Shared.posX.length; i++) {
                    var dist = 1 - Math.min(1, Math.abs(x - Shared.posX[i].get()) / 200, 2);
                    if (dist > 0) {
                        jibu2 *= (dist * 10 + 1);
                        continue;
                    }
                }
                if (jibu2 < 0.1) continue; 
                let nts = Math.floor(Math.abs(noise.perlin3(x / 90, y / 99, Shared.t / 50)) * this.imgList.length);
                ctx.save();
                ctx.translate(x, y);
                // ctx.scale(0.7, 0.7);
                ctx.globalAlpha = jibu2 * (this.opacity.value + this.pulse.value);
                ctx.drawImage(this.imgList[nts], - step / 2, - step / 2)
                // ctx.fillRect();
                ctx.restore();
            }
        }

        ctx.restore();

        for (var i = 0; i < Shared.posX.length; i++) {
            if (Shared.posX[i].pressed && this.isVisible && !this._implode_pending) {
                this.tiny[i].show(Math.round(Shared.posX[i].x / this.step) * this.step, Math.round(Shared.posX[i].y / this.step) * this.step
                    , ("/assets/avatars/f/f" + (Math.round(Shared.posX[i].x / this.step) + Math.round(Shared.posX[i].y / this.step))) + ".jpg"
                );
            } else {
                this.tiny[i].hide();
            }
        }
    }
}
