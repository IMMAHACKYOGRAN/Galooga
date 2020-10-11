function Laser(x, y) {
    this.x = x;
    this.y = y;
    this.sizeX = 3;
    this.sizeY = 11;
    this.toDelete = false;

    this.go = function() {
        this.y = this.y - 3;
    }

    this.draw = function(url, x, y) {
        loadImage(url)
        .then(img => {
            ctx.drawImage(img, x, y);
        });
    }
}