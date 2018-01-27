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
        var r = Math.random() * .5 + 0.3;
        this.dom_scaler = $(this.domElement.find(".scaler")[0]);
        this.dom_at = $(this.domElement.find(".at")[0]);
        this.dom_content = $(this.domElement.find(".content")[0]);
        this.dom_content.css("max-width", px(Math.random() * 100 + 55))
        this.domElement.css("transform", `translate(${px(Math.random() * 3240)}, ${px(Math.floor(Math.random() * 960 / 40) * 40)})`);
        this.dom_scaler.css("transform", `scale(${r}, ${r})`);
    }
}

export class WeiboFloaterManager extends Renderable {
    constructor(_render) {
        super(_render);
        this.domElement = $(`
            <div class="weibo-floaters"></div>
        `);
        for (var i = 0; i < 90; i++) {
            var floater = new WeiboFloater();
            floater.addTo(this);
        }
    }
}