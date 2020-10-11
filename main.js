const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const backgroundURL = './imgs/Background.png';
const playerURL = './imgs/Player.png';
const laserURL = './imgs/Laser-2.png';
const alienShipAURL = './imgs/AlienShip-A.png';
const alienShipBURL = './imgs/AlienShip-B.png';

const dellay = 300;
var fireRate = dellay;

var playerMaxSpeed = 4;
var offset = 30;
var lasers = [];
var invaders = [];
var invadersRow1 = [];
var score = 0;
var hScore = 0;

let shoot;
let arrowDown = 0;
let shootDown = 0;
let cheat = 0;

canvas.width = canvas.height = 400;

function loadImage(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.src = url;
    });
}

function drawDebug() {
// Draw player hitbox
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(
        player.pos.x,
        player.pos.y,
        player.size.x,
        player.size.y
    );
    ctx.stroke();

//Draw Alien hitbox
    for(i = 0; i < invaders.length; i++) {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.rect(
            invaders[i].x,
            invaders[i].y,
            invaders[i].sizeX,
            invaders[i].sizeY
        ); 
        ctx.stroke();
    }

    for(i = 0; i < invadersRow1.length; i++) {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.rect(
            invadersRow1[i].x,
            invadersRow1[i].y,
            invadersRow1[i].sizeX,
            invadersRow1[i].sizeY
        ); 
        ctx.stroke();
    }

    for(i = 0; i < lasers.length; i++) {
        ctx.strokeStyle = 'yellow';
        ctx.beginPath();
        ctx.rect(
            lasers[i].x + 4,
            lasers[i].y,
            lasers[i].sizeX,
            lasers[i].sizeY
        ); 
        ctx.stroke();
    }
}

function draw(url, x, y) {
    loadImage(url)
    .then(img => {
        ctx.drawImage(img, x, y);
    });
}

const background = {
    pos: {x: 0, y: -400}
}

const player = {
    pos: {x: canvas.width / 2 - 11, y: 370},
    size: {x: 22, y:22}
}

function backgroundAnim() {
    background.pos.y++;
    if(background.pos.y === 0) {
        background.pos.y = -400;
    }
}

let lastTime = 0;
function shootCoolDown(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    fireRate += deltaTime;
}

function pewpewHandler() {
    for(i = 0; i < lasers.length; i++) {
        lasers[i].go();
        lasers[i].draw(laserURL, lasers[i].x, lasers[i].y);

        if(lasers[i].y <= -200) {
            lasers[i].toDelete = true;
        }

        if(lasers[i].toDelete) {
            lasers.splice(i, 1);
        }
    }
}

function inputHandler(dir, pos) {
    if (dir > 0 && pos <= canvas.width - offset) {
        player.pos.x += playerMaxSpeed;
    } else if (dir < 0 && pos >= 9) {
        player.pos.x -= playerMaxSpeed;
    }

    if (shootDown === 1 && fireRate > dellay) {
        shoot = new Audio('./sfx/shoot.mp3');
        shoot.volume = 0.5;
        shoot.play();
        var laser0 = new Laser(player.pos.x + 11, player.pos.y);
        var laser1 = new Laser(player.pos.x, player.pos.y);
        lasers.push(laser0, laser1); 
        fireRate = 0   
    }

}

function setupInvaders() {
    for(i = 0; i < 10; i++) {
        var invader = new Invader(i * 32 + canvas.width / 9, 50, 1);
        invaders.push(invader);
    }

    for(i = 0; i < 10; i++) {
        var invaderA = new Invader(i * 32 + canvas.width / 9, 100, 2);
        invadersRow1.push(invaderA);
    }
}

function drawInvaders() {
    for(i = 0; i < invaders.length; i++) {
        invaders[i].draw(alienShipBURL, invaders[i].x, invaders[i].y);
    }

    for(i = 0; i < invadersRow1.length; i++) {
        invadersRow1[i].draw(alienShipAURL, invadersRow1[i].x, invadersRow1[i].y);
    }
}

function getDist(x1, y1, x2, y2) {
    let xDist = x2 - x1;
    let yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

let shipBExplosion;
function collisionDetector () {
    for(i = 0; i < invaders.length; i++) {
        for (j = 0; j < lasers.length; j++) {
            if(getDist(invaders[i].x, invaders[i].y, lasers[j].x, lasers[j].y) < invaders[i].sizeX) {
                shipBExplosion = new Audio('./sfx/ShipBExplosion.mp3');
                shipBExplosion.volume = 1;
                shipBExplosion.play();

                lasers[j].toDelete = true;
                invaders[i].toDelete = true;
            }
            
            if(lasers[j].toDelete) {
                lasers.splice(j, 1);
                
            }
        }
        if(invaders[i].toDelete) {
            invaders.splice(i, 1);
            score += 10;
        }
    }
    for(i = 0; i < invadersRow1.length; i++) {
        for (j = 0; j < lasers.length; j++) {
            if(getDist(invadersRow1[i].x, invadersRow1[i].y, lasers[j].x, lasers[j].y) < invadersRow1[i].sizeX) {
                shipAExplosion = new Audio('./sfx/ShipBExplosion.mp3');
                shipAExplosion.volume = 1;
                shipAExplosion.play();

                lasers[j].toDelete = true;
                invadersRow1[i].toDelete = true;
            }
            
            if(lasers[j].toDelete) {
                lasers.splice(j, 1);
                
            }
        }
        if(invadersRow1[i].toDelete) {
            invadersRow1.splice(i, 1);
            score += 10;
        }
    }
}

function displayScores(ctx, score) {
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillText("Score: " + score, canvas.width / 2, 20);
}

function update(time = 0) {
    displayScores(ctx, score);
    shootCoolDown(time);
    drawDebug();
    backgroundAnim();
    draw(backgroundURL, background.pos.x, background.pos.y);
    draw(playerURL, player.pos.x, player.pos.y);
    drawInvaders();
    pewpewHandler();
    inputHandler(arrowDown, player.pos.x);
    collisionDetector();
    requestAnimationFrame(update)
}

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        arrowDown = 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        arrowDown = -1;
    } else if (e.key === ' ' || e.key === 'w' || e.key === 'ArrowUp') {
        shootDown = 1
    } else if (e.key === 'c') {
        cheat = 1;
    }
  });

window.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        arrowDown -= 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        arrowDown += 1;
    } else if (e.key === ' ' || e.key === 'w' || e.key === 'ArrowUp') {
        shootDown = 0;
    }
});

draw(backgroundURL, background.pos.x, background.pos.y);
draw(playerURL, player.pos.x, player.pos.y);
update();
setupInvaders();
