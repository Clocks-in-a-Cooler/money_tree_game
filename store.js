
var inventory = [];

var item_type = {
    "small_triple_three_fertilizer":{
        "name":"Triple Three Fertilizer",
        "description":"Has everything a plant needs to grow."
        "cost":2,
        "on_use": function()
        {
            Tree.nutrient.N += 0.1;
            Tree.nutrient.K += 0.1;
            Tree.nutrient.P += 0.1;

        },
        
    },
}

function initialize_store()
{
    for(var key in item_type)
    {
        inventory[key] = {item: item_type[key], count: 0};
    }
}

function buy_item(item)
{
    if(item_type[item])
    {
        
    }
    else
    {
        return "Item not found.";
    }
}