let canvas = document.getElementById('canvas') as HTMLCanvasElement;

import imgPath from './images/gamingTrendLogo.png';
import backgroundImagePath from './images/background.png';
// import referencePath 

window.devicePixelRatio = 1;
console.log(imgPath);

function draw(backgroundImage){


let ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.drawImage(backgroundImage,0,0);

drawOverlay(ctx);
// ctx.shadowColor = 'black';
// ctx.shadowBlur = 0;
// ctx.shadowOffsetX = 0;
// ctx.shadowOffsetY = 7;

// ctx.font = '54pt Gothic';
// ctx.fillStyle = 'white';

// ctx.fillText('GAMING', 10, 50);
// ctx.fillText('TREND', 10, 105);

    drawDescription(ctx,'Naval Combat and Recruiting');
    drawSubText(ctx, "Assasin's Creed Odyssey - PC - 4K Max Settings");
    var gtImage = new Image;
    gtImage.addEventListener("load", function () {
        canvas.getContext("2d").drawImage(gtImage, 20, 590);
    });
gtImage.setAttribute('src', imgPath);
};

var backgroundImage = new Image;
backgroundImage.addEventListener("load", function () {
    draw(backgroundImage);
});
backgroundImage.setAttribute('src', backgroundImagePath);

document.getElementById('redraw').onclick = () => draw(backgroundImage);
// draw(backgroundImage);

function drawOverlay(ctx: CanvasRenderingContext2D){
    var gradient = ctx.createLinearGradient(0,530,0,720);
gradient.addColorStop(0,"rgba(0,0,0,0)");
gradient.addColorStop(1,"rgba(0,0,0,255)");
ctx.fillStyle = gradient;
// ctx.fillRect(0,0,200,100);
ctx.fillRect(0, 530, 1280,190);
    // var top = 720-190;
    // var gradient = ctx.createLinearGradient(0,0,0,100);
    // // gradient.addColorStop(0,"rgba(255,255,255,0)");
    // gradient.addColorStop(0, 'white');
    // gradient.addColorStop(1,"rgba(0,0,0,255)");
    // ctx.fillStyle = gradient;
    // ctx.fillRect(0,530, 1280,190);
}

function drawDescription(ctx, description){
    
    // ctx.shadowColor = 'black';
    // ctx.shadowBlur = 0;
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;
    let oldLetterSpacing = canvas.style.letterSpacing;
    canvas.style.letterSpacing = "0.7px";

    ctx.fillStyle = '#37c5ff';
    ctx.font = "bold 50pt 'Exo 2', sans-serif";
    ctx.fillText(description, 150, 642);

    canvas.style.letterSpacing = oldLetterSpacing;    
}

function drawSubText(ctx, desc){
    let oldLetterSpacing = canvas.style.letterSpacing;
    canvas.style.letterSpacing = "1.35px";

    ctx.fillStyle = '#d4d4d4';
    ctx.font = "bold 26pt 'Exo 2', sans-serif";
    ctx.fillText(desc, 154, 686);

    canvas.style.letterSpacing = oldLetterSpacing;  
}
