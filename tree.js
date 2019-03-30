var Tree = {
    water: 0.5,
    
    //NUTRIENTS: N - nitrogen, P - phosphorus, K - potassium
    //balance them...
    nutrient: { N: 0.3, P: 0.1, K: 0.1 },

    health: 4,
    alive: true,

    branches: [],
    leaves: [],
    flowers: [],
    fruits: [],

    stage: 0, // 0: growing, 1: flowering, 2: fruiting

    add_branch: function(new_branch) {
        this.branches.push(new_branch);
    },
    
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
            this.health -= (this.water - 0.9) / 10;
        } else if (this.water < 0.4) {
            //drying out
            this.health -= (0.4 - this.water) / 10;
        } else {
            this.health += 0.01;
        }

        if ((this.nutrient.N + this.nutrient.P + this.nutrient.K) / 2 > this.water) {
            //roots are burning
            this.health -= 0.1;
        }

        this.health = Math.min(Math.max(0, this.health), 4);
        //will fill in the rest.
    },

    get leaf_colour() {
        if (this.health > 3) {
            //healthy green leaves
            return {r: 0, g: 100, b: 0};
        } else {
            var r = 0, g = 100, b = 0;

            //y = mx + b, kids!
            r += Math.round((3 - this.health) * (240 / 3));
            g += Math.round((3 - this.health) * (130 / 3));
            b += Math.round((3 - this.health) * (140 / 3));

            var c = {};
            c.r   = r; c.g = g; c.b = b;
            return c;
        }
    },

    harvest: function() {
        if (this.stage != 2) return;
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
                if (this.flowers.every((f) => { return f.pollinated; })) {
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
            default : break;
        }
    },
    
    start_growing: function(start_x, start_y, height) {
        this.add_branch(new Branch({x: start_x, y: start_y}, -Math.PI / 2, 0));
    },
    
    update: function(lapse) {
        this.calculate_health();
        if (this.health <= 0) {
            log("tree is dead!"); // ...and you failed as a gardener!
            this.alive = false;
            return;
        }
        
        this.branches.forEach((b) => { b.grow(lapse); });
    },
    
    water: function() {
        this.water += 0.1;
        log("tree watered.");
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
    this.angle   = angle;
}

Money_leaf.prototype.get_control_points = function() {
    var control_points = [];
    
    var angle = this.angle;
    
    var midpoint = {
        x: (this.start.x + this.end.x) / 2,
        y: (this.start.y + this.end.y) / 2,
    };
    
    control_points.push({
        x: Math.cos(angle - Math.PI / 2) * LEAF_WIDTH + midpoint.x,
        y: Math.sin(angle - Math.PI / 2) * LEAF_WIDTH + midpoint.y
    });
    
    control_points.push({
        x: Math.cos(angle + Math.PI / 2) * LEAF_WIDTH + midpoint.x,
        y: Math.sin(angle + Math.PI / 2) * LEAF_WIDTH + midpoint.y
    });
    
    return control_points;
};

//yup. that's it.

//money tree branch ------------------------------------------------------------
function Branch(start, angle, generation) {
    this.start      = start;
    this.angle      = angle;
    this.length     = 0;
    this.end        = start;
    this.generation = generation || 0;
    this.max_length = this.base_length * Math.pow(this.gen_ratio, this.generation);
    
    this.last_growth = 0;
    this.growth_dist = this.base_growth_dist * Math.pow(this.gen_ratio, this.generation);
}

Branch.prototype.growspeed      = 0.03;
Branch.prototype.leaf_angle_var = 2 * Math.PI / 3;
Branch.prototype.gen_ratio      = 0.5;
Branch.prototype.base_length    = 300;
Branch.prototype.max_generation = 2;

Branch.prototype.width = 5;

Branch.prototype.base_growth_dist = 30;
Branch.prototype.growth_chances   = [
    { "branch": 1, "leaf": 0, },
    { "branch": 0.5, "leaf": 0.5, },
    { "branch": 0, "leaf": 1, }
];

Branch.prototype.get_points = function() {
    var points = [];
    var width  = this.width;
    var angle  = this.angle;
    var start  = this.start;
    
    points.push(this.start);
    points.push({
        x: Math.cos(angle - Math.PI / 2) * width + start.x,
        y: Math.sin(angle - Math.PI / 2) * width + start.y,
    });
    
    points.push(this.end);
    
    points.push({
        x: Math.cos(angle + Math.PI / 2) * width + start.x,
        y: Math.sin(angle + Math.PI / 2) * width + start.y,
    });
    
    return points;
};

Branch.prototype.grow = function(lapse) {
    if (this.length < this.max_length) {
        //grow!
        this.length += this.growspeed * lapse;
        this.last_growth += this.growspeed * lapse;
        this.end = {
            x: Math.cos(this.angle) * this.length + this.start.x,
            y: Math.sin(this.angle) * this.length + this.start.y,
        };
    }
    
    var grow_leaf = false;
    if (this.last_growth >= this.growth_dist) {
        this.last_growth -= this.growth_dist;
        grow_leaf = true;
    }
    
    if (grow_leaf) {
        //grow a new leaf or branch
        if (this.generation < 3 && Math.random() < this.growth_chances[this.generation]["branch"]) {
            //new branch
            Tree.add_branch(new Branch(
                {x: this.end.x, y: this.end.y},
                Math.random() * this.leaf_angle_var + this.angle - (this.leaf_angle_var / 2),
                this.generation + 1
            ));
        } else {
            //new leaf
            Tree.add_leaf(new Money_leaf(
                this.end.x,
                this.end.y,
                Math.random() * this.leaf_angle_var + this.angle - (this.leaf_angle_var / 2)
            ));
        }
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
