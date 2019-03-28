function draw_tree(context) {
    //draw the branches

    //draw each leaf
    context.fillStyle = Tree.leaf_colour;
    Tree.leaves.forEach((l) => {
        context.beginPath();
        context.moveTo(l.start.x, l.start.y);
    });
}