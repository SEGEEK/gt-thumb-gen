import imgPath from './images/gamingTrendLogo.png';
import {convertURIToImageData} from './ImageUtil';

let gamingTrendLogo = convertURIToImageData(imgPath);

export class ThumbnailGenerator{
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
    }

    public draw(input: ThumbnailGenInput) {
        console.log('draw called', input);
    
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        ctx.drawImage(input.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    
        this.drawOverlay(ctx);
    
        if (input.description) {
            this.drawDescription(ctx, input.description);
        }
        if (input.subText) {
            this.drawSubText(ctx, input.subText);
        }
        gamingTrendLogo.then(gtImage => this.canvas.getContext("2d").drawImage(gtImage, 20, 590));
    }

    private drawOverlay(ctx: CanvasRenderingContext2D) {
        var gradient = ctx.createLinearGradient(0, 530, 0, 720);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,255)");
        ctx.fillStyle = gradient;
        // ctx.fillRect(0,0,200,100);
        ctx.fillRect(0, 530, 1280, 190);
        // var top = 720-190;
        // var gradient = ctx.createLinearGradient(0,0,0,100);
        // // gradient.addColorStop(0,"rgba(255,255,255,0)");
        // gradient.addColorStop(0, 'white');
        // gradient.addColorStop(1,"rgba(0,0,0,255)");
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0,530, 1280,190);
    }

    private drawDescription(ctx, description) {
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        let oldLetterSpacing = this.canvas.style.letterSpacing;
        this.canvas.style.letterSpacing = "0.7px";
    
        ctx.fillStyle = '#37c5ff';
        ctx.font = "bold 50pt 'Exo 2', sans-serif";
        ctx.fillText(description, 150, 642);
    
        this.canvas.style.letterSpacing = oldLetterSpacing;
    }

    private drawSubText(ctx, desc) {
        let oldLetterSpacing = this.canvas.style.letterSpacing;
        this.canvas.style.letterSpacing = "1.35px";
    
        ctx.fillStyle = '#d4d4d4';
        ctx.font = "26pt 'Exo 2', sans-serif";
        // ctx.fillText(desc, 154, 686);
        ctx.fillText(desc, 154, 680);
    
        this.canvas.style.letterSpacing = oldLetterSpacing;
    }
}

interface ThumbnailGenInput {
    backgroundImage?: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement | ImageBitmap;
    description?: string;
    subText?: string;
}