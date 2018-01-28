import "./style.less";
import * as DOMFx from "./dom.js";
import { Shared, DOMRenderable } from "../base.js";
import "./perlin.js";

export var root = new DOMFx.FixedContainer();
root.domElement.appendTo($(document.body));

import {
    pMoveBehavior, pPointsRenderer, pLinesRenderer, pDragLineRenderer,
    pTargetBehavior, pBlinkBehavior, pFadeBehavior, pDampingBehavior,
    pGravityBehavior, pNoiseBehavior, pRandomBehavior
} from "./particle-modules.js";
import { pSys, pBehavior, pRenderer } from "./particles.js";
import { THREERenderable, BuildRenderable } from "../base.js";
import * as THREE from "three";
import * as glmat from "gl-matrix";


export class pDomRenderer extends pRenderer {
    constructor(params) {
        super(params);
        params.size = params.size || 0;
        params.range_min = params.range_min || 10;
        params.range_max = params.range_max || 85;
        this.manager = new DOMFx.WeiboFloaterManager(() => { }, params.size);
        this.floaters = this.manager.floaters;
        root.add(this.manager);
    }
    onRender(sys) {
        for (var i = 0; i < sys.ps.length; i++) {
            let c = sys.ps[i];
            if (c._dead) continue;

            if (c.p[2] > this.params.range_min && c.p[2] < this.params.range_max && Math.random() > 0.01) {
                //good
                if (!c.bag.floater && this.floaters.length && Math.random() > 0.99) {
                    c.bag.floater = this.floaters.pop();
                }
                if (!c.bag.floater) {
                    continue;
                }
                var vector = new THREE.Vector3(c.p[0], c.p[1], c.p[2]).project(Shared.camera);
                vector.x = (vector.x + 1) / 2 * Shared.W;
                vector.y = -(vector.y - 1) / 2 * Shared.H;
                c.bag.floater.setPos(vector.x, vector.y, 1);
                c.bag.floater.show();
            } else if (c.bag.floater) {
                c.bag.floater.hide();
                this.floaters.push(c.bag.floater);
                c.bag.floater = undefined;
            }
        }
    }
}


export var Scene = new THREERenderable();
var target = new pTargetBehavior({ enabled: true, power: 0.1, powerColor: 0.1, clamp: 2 });
target.generateDemoTarget("#");

window.target = target

var WaveSystem = BuildRenderable((group) => {
    var gravity = new pGravityBehavior({ eanbled: true, g: 1000, clamp: 0.2 });
    var velocity = new pMoveBehavior({ enabled: true, stage: "velocity" });
    var noise = new pNoiseBehavior({ enabled: true, power: 15 });
    var damp = new pDampingBehavior({ enabled: true, power: 0.9 });
    var random = new pRandomBehavior({ enabled: true, power: 0.6 });
    var position = new pMoveBehavior({ enabled: true, stage: "position" });
    var blink = new pBlinkBehavior({ enabled: true });
    var fade = new pFadeBehavior({ enabled: true, speed: 0.01 });
    var render = new pPointsRenderer({ size: 20000, enabled: true });
    var domrenderer = new pDomRenderer({ size: 50, enabled: true })
    var sys = new pSys(20000,
        [
            target,
            gravity,
            random,
            velocity,
            damp,
            // noise,
            position,
            fade,
            blink
        ],
        [
            render,
            domrenderer
        ]);

    for (var i = 0; i < 20000 && i < sys.seek(); i++) {
        sys.emit((pt) => {
            pt.l = Infinity;
            let deg = Math.random() * Math.PI * 2;
            let r = Math.random();

            //pt.p = [(Math.random() - 0.5) * 200, -50, Math.random() * 400];
            // pt.p = [Math.sin(deg) * r * 300, -40 + (Math.random() * 20 - 5) * Math.cos(r * Math.PI), Math.cos(deg) * r * 300 + 200];
            pt.p = [Math.sin(deg) * r * 300, -45, Math.cos(deg) * r * 370];
            pt.p = [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30];
            pt.c = [1, 1, 1];
            pt.v = [(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5];
            pt.alpha = 0;
        });
    }
    render.material.sizeAttenuation = true;
    render.material.size = 4;
    render.material.map = THREE.ImageUtils.loadTexture("/assets/Dot.png");
    group.add(render.mesh);
    return () => {
        target.params.power = Shared.timeline.at(0, 2, Shared.timeline.EasingFunctions.linear, 0, 0.01);
        random.params.power = Shared.timeline.at(0, 7, Shared.timeline.EasingFunctions.linear, 0.8, 0);

        gravity.params.enabled = Shared.timeline.at(0, 3, Shared.timeline.EasingFunctions.linear) > 0.9;
        // console.log(gravity.params.enabled);

        // target.params.enabled = Shared.timeline.t < 4;
        // gravity.params.enabled = gravity.params.enabled && Shared.timeline.t < 7;
        gravity.params.g = Shared.timeline.at(4, 1, Shared.timeline.EasingFunctions.linear, 3000, -20000);
        sys.update(Shared.timeline.at(3, 8, Shared.timeline.EasingFunctions.linear, 1, 0.03));
        sys.render();
    };
}).addTo(Scene);




function px(p) {
    return ((100 / 3240) * p) + "vw";
}

class AvatarManager extends DOMRenderable {
    constructor(_render) {
        super(_render);
        this.tiny = [];
        this.domElement = $(`
            <div class="avatar-floaters"></div>
        `);
        for (var i = 0; i < Shared.posX.length; i++) {
            var avatar = new AvatarTiny();
            avatar.addTo(this);
            this.tiny.push(avatar);
        }
    }

    render() {
        super.render();

        for (var i = 0; i < Shared.posX.length; i++) {
            if (Shared.posX[i].pressed) {
                this.tiny[i].show(Math.round(Shared.posX[i].x / 40) * 40, Math.round(Shared.posX[i].y / 40) * 40
                    , ("/assets/avatars/f/f" + (Math.round(Shared.posX[i].x / 40) + Math.round(Shared.posX[i].y / 40))) + ".jpg"
                );
            } else {
                this.tiny[i].hide();
            }
        }

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

var avatarManager = new AvatarManager();
root.add(avatarManager);

var canvas = document.createElement("canvas");
canvas.classList.add("suite-canvas");
canvas.id = "bgcanvas";

function loadImg(url) {
    var img = new Image();
    img.src = url;
    return img;
}

var imgList = [];

for (var i = 1; i < 200; i++) {
    imgList.push(loadImg("/assets/avatars/f/f" + i + ".jpg"));
    imgList.push(loadImg("/assets/avatars/m/m" + i + ".jpg"));
}


document.body.insertBefore(canvas, document.querySelector("#maincanvas"));

var ctx = canvas.getContext("2d");
canvas.width = 3240;
canvas.height = 960;

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
            ctx.drawImage(imgList[nts], - step / 2, - step / 2, step - 2, step - 2)
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