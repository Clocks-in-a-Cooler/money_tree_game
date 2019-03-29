function draw_tree(context) {
    //draw the branches
    context.fillStyle = "chocolate";
    Tree.branches.forEach((b) => {
        var p = b.get_points();
        
        context.beginPath();
        context.moveTo(p[0].x, p[0].y);
        context.lineTo(p[1].x, p[1].y);
        context.lineTo(p[2].x, p[2].y);
        context.lineTo(p[3].x, p[3].y);
        context.closePath();
        context.fill();
    });
    
    /*
    //draw each leaf
    context.fillStyle = Tree.leaf_colour;
    Tree.leaves.forEach((l) => {
        var points = l.get_control_points();
        context.beginPath();
        context.moveTo(l.start.x, l.start.y);
        context.quadraticCurveTo(l.end.x, l.end.y, points[0].x, points[0].y);
        context.quadraticCurveTo(l.start.x, l.start.y, points[1].x, points[1].y);
        context.closePath();
        context.fill();
    });*/
}