function Invader(x, y, type) {
    this.x = x;
    this.y = y;
    this.sizeX = 18;
    this.sizeY = 20;
    this.type = type;
    this.toDelete = false;

    this.draw = function(url, x, y) {
        loadImage(url)
        .then(img => {
            ctx.drawImage(img, x, y); 
        });
    }
}