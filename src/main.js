import * as THREE from "three";
import * as THREEBootstrap from "./three-bootstrap.js";
import * as Base from "./base.js";

function update() {
    requestAnimationFrame(update);
    //calculate size
    THREEBootstrap.update();
}

update();