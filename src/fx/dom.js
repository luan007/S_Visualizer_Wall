import "./style.less";
import { Renderable, DOMRenderable } from "../base.js";

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

export class WeiboFloaterManager extends Renderable {
    constructor(_render, size) {
        super(_render);
        this.domElement = $(`
            <div class="weibo-floaters"></div>
        `);
        this.floaters = [];
        for (var i = 0; i < size; i++) {
            var floater = new WeiboFloater();
            floater.addTo(this);
            this.floaters.push(floater);
        }
    }
}