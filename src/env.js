import { Timer, SlideEase, Renderable } from "./base.js"

var root = new Renderable();

//state machine
//VIZ -> NOTVIZ -> VIZ
//...    ...       ..(AGGR)
//DONE DONE DONE (CHANGE)

//visibility state (ease)
//requried state ?= (state) && (state) ...
//r-meet

export var Shared = window.Shared = {
    W: 3240,
    H: 960,
    t: 0,
    timeline: new Timer().addTo(root),
    posX: [
        new SlideEase().addTo(root)
    ],
    data: {
        title: "heiqu 5"
    }
};

export function update() {
    Shared.t += 0.01;
    root.update();
}

// Shared.timeline.start();

document.addEventListener("mousemove", (e) => {
    Shared.posX[0].set(e.pageX / window.innerWidth * Shared.W);
    Shared.posX[0].x = (e.pageX / window.innerWidth * Shared.W);
    Shared.posX[0].y = (e.pageY / window.innerWidth * Shared.W);
});

document.addEventListener("mousedown", (e) => {
    Shared.posX[0].pressed = true;
});

document.addEventListener("mouseup", (e) => {
    Shared.posX[0].pressed = false;
});


onresize = () => {
    var w = window.innerWidth;
    var h = w / Shared.W * Shared.H;
    $(".suite-canvas").css({
        width: w,
        height: h
    });
    // canvas.style.width = w;
    // canvas.style.height = h;
    Shared.w = w;
    Shared.h = h;
};

setTimeout(() => {
    onresize();
}, 300);