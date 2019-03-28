var Tree = {
    water: 0.5,
    
    //NUTRIENTS: N - nitrogen, P - phosphorus, K - potassium
    //balance them...
    nutrient: { N: 0.3, P: 0.1, K: 0.1 },

    health: 4,
    alive: true,

    leaves: [],
    flowers: [],
    fruits: [],

    stage: 0, // 0: growing, 1: flowering, 2: fruiting

    add_leaf: function(new_leaf) {
        this.leaves.push(new_leaf);
    },
    
    add_flower: function(new_flower) {
        this.flowers.push(new_flower);
    },
    
    add_fruit: function(new_fruit) {
        this.fruits.push(new_fruit);
    },

    calculate_health: function() {
        if (this.water > 0.9) {
            //overwatered
            this.health -= this.water - 0.9;
        } else if (this.water < 0.4) {
            //drying out
            this.health -= 0.4 - this.water;
        } else {
            this.health += 0.1;
        }

        if ((this.nutrient.N + this.nutrient.P + this.nutrient.K) / 2 > this.water) {
            //roots are burning
            this.health -= 1;
        }

        this.health = Math.min(Math.max(0, this.health), 4);
        //will fill in the rest.
    },

    get leaf_colour() {
        if (this.health > 3) {
            //healthy green leaves
            return "rgb(0, 100, 0)";
        } else {
            var r = 0, g = 100, b = 0;

            //y = mx + b, kids!
            r += Math.round((3 - this.health) * (240 / 3));
            g += Math.round((3 - this.health) * (130 / 3));
            b += Math.round((3 - this.health) * (140 / 3));

            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    },

    harvest: function() {
        if (this.stage != 2) return;
        this.fruits.filter((f) => { return f.is_ripe(); });
    },

    next_stage: function() {
        //check if the plant is healthy enough
        if (this.health < 2.5) {
            this.stage = 0;
            return;
        }

        switch (this.stage) {
            case 0:
                //check if the plant has enough nutrients to flower
                if (this.nutrients.N > 0.4 && this.nutrients.P > 0.3) {
                    this.stage = 1;
                    while (this.nutrients.P > 0) {
                        this.flowers.push(new Money_flower());
                        this.nutrients.P -= 0.05;
                    }
                }
                break;
            case 1:
                //all flowers done?
                if (this.flowers.every((f) => { return f.pollinated; }) {
                    //check for nutrient K now
                    while (this.nutrient.N > 0 && this.nutrient.K > 0 && this.flowers.length > 0) {
                        this.flowers.pop();
                        this.nutrient.N -= 0.05; this.nutrient.K -= 0.05;
                        this.fruits.push(new Money_fruit());
                    }
                }
                break;
            case 2:
                break;
        }
    },

    update: function(lapse) {
        calculate_health();
    },
    
    water: function() {
        
    },
};

//money leaf -------------------------------------------------------------------

var LEAF_LENGTH = 30; //in pixels, the length of the leaf.
var LEAF_WIDTH  = 15;

function Money_leaf(x, y, angle) {
    this.start   = {};
    this.start.x = x ;
    this.start.y = y;
    this.end     = {};
    this.end.x   = Math.cos(angle) * LEAF_LENGTH + x;
    this.end.y   = Math.sin(angle) * LEAF_LENGTH + y;
}

Money_leaf.prototype.get_control_points = function() {
    //for now, just find the midpoint of the leaf line, and go a set number of
    //units.
    //yeah, I know it'd look weird.
    
    var control_points = [];
    
    var midpoint = {
        x: (this.start.x + this.end.x) / 2,
        y: (this.start.y + this.end.y) / 2,
    };
    
    control_points.push({
        x: midpoint.x + this.LEAF_WIDTH,
        y: midpoint.y + this.LEAF_WIDTH
    });
    
    control_points.push({
        x: midpoint.x - this.LEAF_WIDTH,
        y: midpoint.y - this.LEAF_WIDTH
    });
    
    return control_points;
};

//yup. that's it.

//money branch -----------------------------------------------------------------
function Branch(start, angle) {
    this.x = start.x; this.y = start.y;
    this.angle = angle;
    this.max_length = Math.random() * 250 + 250;
    this.length = 0;
    this.end = start;
}

Branch.prototype.growspeed = 0.03;
Branch.prototype.leaf_angle_var = Math.PI / 6;

Branch.prototype.grow = function(lapse, new_leaf) {
    if (this.length < this.max_length) {
        //grow!
        this.length += this.growspeed * lapse;
        this.end = {
            x: Math.cos(this.angle) * this.length + this.x,
            y: Math.sin(this.angle) * this.length + this.y,
        };
    }

    if (new_leaf) {
        Tree.add_leaf(new Money_leaf());
    }
}

//money flower -----------------------------------------------------------------
function Money_flower(x, y) {
    this.x = x; this.y = y;
    
    this.pollinated        = false;
    this.pollination_delay = Math.random() * 10000 + 10000;
    this.lifetime          = 0; //10 to 20 seconds of flowering, then fruiting stage
}

Money_flower.prototype.petal_colour  = "lavender";
Money_flower.prototype.centre_colour = "goldenrod";

Money_flower.prototype.update = function(lapse) {
    this.lifetime += lapse;
    if (this.lifetime > this.pollination_delay) {
        this.pollinated = true;
    }
};

Money_flower.prototype.fruit = function() {
    if (this.pollinated) {
        //return a fruit, on its way to be ripened.
    } else {
        //not pollinated, just die off, I guess.
    }
};

//money fruit ------------------------------------------------------------------
function Money_fruit(x, y) {
    this.lifetime = 0;
    
    this.x = x; this.y = y;
    
    this.r = 60; this.g = 179; this.b = 113;
    
    this.money = Math.floor(Math.random() * 3 + 3);
}

Money_fruit.prototype.ripening_time = 60000; //a full minute. soyez patiente.

Money_fruit.prototype.update = function(lapse) {
    this.lifetime += lapse;
    this.lifetime = Math.min(this.lifetime, this.ripening_time);
    
    //update the colour to 255, 99, 71
    this.r = Math.round((195 / this.ripening_time) * this.lifetime + 60);
    this.g = Math.round((80 / this.ripening_time) * this.lifetime * -1 + 179);
    this.b = Math.round((42 / this.ripening_time) * this.lifetime * -1 + 113);
};

Money_fruit.prototype.get_colour = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
};

Money_fruit.prototype.is_ripe = function() {
    return this.lifetime >= this.ripening_time;
};