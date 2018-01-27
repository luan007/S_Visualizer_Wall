import "./style.less";
import { Renderable, DOMRenderable } from "../base.js";


export class WeiboFloater extends DOMRenderable {
    constructor(_render) {
        super(_render);
        this.domElement = $(`
            <div class="weibo-floater">
                <div class="at">@人民日报</div>
                <div class="content">【你愿为他们转吗？大雪过后刷屏的不仅是雪景，还有这张让人心疼的照片[心]】这两天，南京抗击暴雪，全城7.8万人上街扫雪。这张照片摄于南京建邺区文化艺术中心小剧场，26日清晨，某舟桥旅官兵540余人，结束彻夜扫雪除冰任务后，在此休息。他们中绝大部分是90后、95后。（现代快报）网友：最可爱的人！</div>
            </div>
        `);
        this.dom_at = this.domElement.find(".at")[0];
        this.dom_content = this.domElement.find(".content")[0];
    }
}

export class WeiboFloaterManager extends Renderable {
    constructor(_render) {
        super(_render);
        this.domElement = $(`
            <div class="weibo-floaters"></div>
        `);
        for(var i = 0; i < 1000; i++) {
            var floater = new WeiboFloater();
            floater.addTo(this);
        }
    }
}