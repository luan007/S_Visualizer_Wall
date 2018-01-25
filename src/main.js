import * as THREE from "three"

var cv = document.getElementById('maincanvas');

const W = 3240;
const H = 960;

function update() {
    requestAnimationFrame(update);
    //calculate size
    
}

update();

onresize = function () {
    var w = window.innerWidth;
    var h = w / W * H;
    cv.style.width = w;
    cv.style.height = h;
}

onresize();