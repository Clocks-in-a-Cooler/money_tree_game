var Tree = {
    water: 0.5,

    //NUTRIENTS: N - nitrogen, P - phosphorus, K - potassium
    //balance them...
    nutrient: { N: 0.3, P: 0.1, K: 0.1 },

    health: 4,
    alive: true,

    flowers: [],
    fruit: [],

    stage: 0, // 0: growing, 1: flowering, 2: fruiting

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
};

function Money_flower() {
    this.pollinated = false;
    this.pollination_delay = Math.random() * 10000 + 10000;
    this.lifetime = 0; //10 to 20 seconds of flowering, then fruiting stage
}

Money_flower.prototype.colour = "lavender";

Money_flower.prototype.update = function(lapse) {
    this.lifetime += lapse;
    if (this.lifetime > this.pollination_delay) {
        this.pollinated = true;
    }
};

function Money_fruit() {
    this.lifetime = 0;
    
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