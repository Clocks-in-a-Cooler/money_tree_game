//various utility functions

function random_number(start, end) {
    var multiplier = Math.abs(start - end);
    var adder      = Math.min(start, end);
    
    return Math.floor(Math.random() * multiplier + adder);
}

function random_element(a) {
    return a[random_number(0, a.length)];
}

function angle_from(start, end) {
    var hypot = Math.hypot((end.x - start.x), (end.y - start.y));
    var opp   = end.y - start.y;
    
    var angle = Math.asin(opp / hypot);
    
    if (end.x < start.x) angle = Math.PI - angle;
    
    return angle;
}

var is_logging = true;
function log(msg) {
    if (is_logging) console.log(msg);
}