console.log("hello there 1");

const NUMBER_TARGETS = 10;
const TARGET_RADIUS = 5;
const SCROLL_SPEED = 5;
const FPS = 25;
const MARKER_SPEED = 5;

let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');

let targets = [];
let marker = null;

let yScroll = 0;

class Circle {
    constructor(xStart, yStart) {
        this.x = xStart;
        this.y = yStart;
    }

    calcX() {
        return this.x + canvas.width/2;
    }

    calcY() {
        return canvas.height - this.y + yScroll;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.calcX(), this.calcY(), TARGET_RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
        this.fill();
    }

}

class Target extends Circle {

    fill() {
        ctx.fillStyle = "lightblue"
        ctx.fill();
    }

}

class Marker extends Circle {

    calcY() {
        return canvas.height - this.y;
    }

    fill() {
        ctx.fillStyle = "red"
        ctx.fill();
    }

}

function init() {
    
    for (let i=0; i<NUMBER_TARGETS; ++i) {

        let xStart = 0;
        let yStart = canvas.height/2 + i*20
        
        targets.push(new Target(xStart, yStart));
    
    }
    marker = new Marker(0, canvas.height/2);
    
    setInterval(function() {
    
        yScroll += SCROLL_SPEED;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        targets.forEach((t) => {
            t.draw()
        })

        marker.draw();

    }, 1000/FPS);

}
init();

document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    switch (event.keyCode) {
        // left arrow
        case 37: 
            marker.x -= MARKER_SPEED;
            break;
        // right arrow
        case 39: 
            marker.x += MARKER_SPEED;
            break;

    }

});