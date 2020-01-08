console.log("hello there 1");

const NUMBER_TARGETS = 200;
const FPS = 25;
const TARGET_RADIUS = 10;
const TARGET_X_VAR = 20;
const TARGET_Y_INT = 40;
const X_MARGIN = 50;

var SCROLL_SPEED = 10;
var MARKER_SPEED = 5;


let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');

let targets = [];
let marker = null;

let yScroll = 0;
let score = 0;

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
    hit = false;

    fill() {
        ctx.fillStyle = this.hit ? "blue" : "lightblue";
        ctx.fill();
    }

    checkIfHit() {
        if (this.hit)
            // we know target has been hit, no need to check again
            return

        // check to see if target is coinciding with marker
        this.hit =    this.x < marker.x + TARGET_RADIUS*2           && this.x > marker.x - TARGET_RADIUS*2 
                   && this.y < marker.y + TARGET_RADIUS*2 + yScroll && this.y > marker.y - TARGET_RADIUS*2 + yScroll

        if (this.hit)
            score += 1;

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
    
    let lastX = 0;
    let segmentCounter = 0;
    let direction = 1;
    for (let i=0; i<NUMBER_TARGETS; ++i) {

        // y position is regular
        let y = canvas.height/2 + i*TARGET_Y_INT

        // x varies
        let x;

        let delta = Math.abs( Math.round( Math.random() * TARGET_X_VAR ) );
        let halfWidth = canvas.width/2-X_MARGIN;

        if ( segmentCounter <= 0 ) {
            // weight direction towards centre
            if ( Math.random() > 0.7 ) {
                // toggle direction
                direction = -direction
            } else {
                // go towards centre
                direction = ( lastX > 0 ) ? -1 : 1
            }
            
            segmentCounter = Math.round( Math.random() * 30 );
        }
        --segmentCounter;

        // weight direction towards centre
        //let direction = (lastX > 0) ? -1 : 1;
        //if ( Math.random() > 0.5*Math.abs(lastX)/halfWidth ) direction = -direction;

        if ( lastX < -halfWidth )
            // too far left
            x = lastX + Math.abs(delta);
        else if ( lastX > halfWidth )
            // too far right
            x = lastX - Math.abs(delta);
        else
            // fine to go either way (and delta is signed)
            x = lastX + direction * delta;

        targets.push(new Target(x, y));
        lastX = x;
    }
    marker = new Marker(0, canvas.height/2);
    
    ctx.font = "24px Arial";
    setInterval(function() {
    
        // check limits of x
        if (marker.x < -canvas.width/2) marker.x = -canvas.width/2;
        if (marker.x >  canvas.width/2) marker.x =  canvas.width/2;

        yScroll += SCROLL_SPEED;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.fillText(`${score} / ${NUMBER_TARGETS}`, 10, 34);

        marker.draw();

        targets.forEach((t) => {
            t.checkIfHit()
            t.draw()
        })

    }, 1000/FPS);

}
init();

// arrow keys

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

// orientation sensor
let output = document.getElementById('output');
output.innerHTML = "hello";

function handleOrientation(event) {
    var x = event.beta;  // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]
    
    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x >  90) { x =  90};
    if (x < -90) { x = -90};

    // constrain y to -30 to 30
    if (y >  30) { y =  30};
    if (y < -30) { y = -30};

    output.innerHTML  = "x : " + x + "\n";
    output.innerHTML += "y : " + y + "\n";  

    marker.x += Math.round( y * MARKER_SPEED * 0.1 );

}
window.addEventListener('deviceorientation', handleOrientation);
  

// sliders
document.getElementById("slider-speed").addEventListener('change', (event) => {
    SCROLL_SPEED = parseInt(event.currentTarget.value);
});

document.getElementById("slider-gain").addEventListener('change', (event) => {
    MARKER_SPEED = parseInt(event.currentTarget.value);
});