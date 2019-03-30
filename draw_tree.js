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
    
    //draw each leaf
    context.fillStyle   = get_colour(Tree.leaf_colour);
    context.strokeStyle = get_colour(darken_colour(Tree.leaf_colour));
    context.lineWidth   = 2;
    Tree.leaves.forEach((l) => {
        var points = l.get_control_points();
        context.beginPath();
        context.moveTo(l.start.x, l.start.y);
        context.quadraticCurveTo(points[0].x, points[0].y, l.end.x, l.end.y);
        context.quadraticCurveTo(points[1].x, points[1].y, l.start.x, l.start.y);
        context.closePath();
        context.stroke();
        context.fill();
    });
}