scene("selecao", () => {
    const overlay = add([
        rect(width(), height()),
        pos(0, 0),
        color(255, 255, 255),
        opacity(1),
        z(100),
    ]);

    tween(
        1,
        0,
        0.5,
        (v) => overlay.opacity = v, 
        easings.easeOutQuad
    );

    
});