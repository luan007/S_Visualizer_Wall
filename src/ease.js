//a very lightweight easing funciton
//input 
// {}
//changes : val.value
//returns : delta ? true : false

const EASE_DEFAULT_STEP = 0.1;
const EASE_PREC = 0.001; //+/-
const EASE_POWER = 0;

export function ease(val) {
    //returns delta
    val.value = val.value == undefined ? 0 : val.value;
    val.target = val.target == undefined ? 0 : val.target;
    if (val.value == val.target) {
        val.running = false;
        return false;
    }
    val.running = true;
    var delta = -val.value + val.target;
    if (Math.abs(delta) <= (val.prec == undefined ? EASE_PREC : val.prec)) {
        val.value = val.target;
        return true;
    }
    val.value += Math.pow(delta, 1 + (val.power == undefined ? EASE_POWER : val.power)) * (val.ease == undefined ? EASE_DEFAULT_STEP : val.ease);
    return true;
}

function map(t, a, b, c, d) {
    return ((t - a) / (b - a)) * (d - c) + c;
}

export function remap(val, from, to, from2, to2) {
    from2 = from2 || 0;
    to2 = to2 || 1;
    return map(val.value, from, to, from2, to2)
}
