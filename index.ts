let canvas = document.getElementById('canvas') as HTMLCanvasElement;

import imgPath from './images/gamingTrendLogo.png';
import backgroundImagePath from './images/background.png';
import {YoutubeVideo} from './youtube-video';

var urls = ['https://youtu.be/X_Ch70KkMtE?t=2m57s', 'https://youtu.be/X_Ch70KkMtE', 'https://www.youtube.com/watch?v=X_Ch70KkMtE', 'https://www.youtube.com/watch?v=X_Ch70KkMtE&t=2m57s'];
urls.forEach(u => console.log(u, YoutubeVideo.parseYoutubeUrl(u)));

interface Rect{
    x: number;
    y: number;
    width: number;
    height: number;
}

function getAdjustmentForImageAndCanvas(imageRect:Rect, canvasRect: Rect) : {source:Rect, destination:Rect} {
    if(imageRect.width === canvasRect.width && imageRect.height === canvasRect.height){
        return {
            source: {...imageRect},
            destination: {... imageRect}
        };
    }
    //example time ... 10x5 going into 10x10
    // scale image by 2 to 20x10 into 10x10
     //
    return {
        source:{x: 0, y: 0, width: 0, height:0},
        destination: {x: 0, y: 0, width: 0, height:0}
    };
}

let backgroundImagePromise: Promise<HTMLImageElement>  = new Promise((resolve,reject) => reject('No Background Image specified');

let description = 'Holly Saves Time' //'Naval Combat and Recruiting';
let subText = "Wow this is awesome, I can't believe it"//"Assasin's Creed Odyssey - PC - 4K Max Settings";

document.body.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    document.getElementById('dropPreview')
    .innerHTML = `Background Image: ${file.name} - type:${file.type} - size ${file.size}B`;
    console.info('dropped file detected', file);
  
    reader.onload = function (e) {
      // image.src = e.target.result;
    //   image.src = reader.result as string;
      backgroundImagePromise = convertURIToImageData(reader.result)
    //   image.onload = setUp;
    }
    reader.readAsDataURL(file);
  })

async function getVideoUrl(videoId ) {
    return YoutubeVideo.getVideoInfo(videoId)
    .then((video) => {
        console.log('video', video);
        console.log('hd stream', video.getSource('mp4', 'hd720'));
        let videoSource = video.getSource('mp4', 'hd720');
        let videoUrl = videoSource.url;
        if(!videoUrl){
            throw new Error('Unable to attain video url');
        }
        return videoUrl;
    })
    .catch(error => console.log('Error', error));
}

async function getVideoFrame(videoId, seektime?: number){
    let url = await getVideoUrl(videoId);
    let extractor = new VideoFrameExtractor(url);
    if(seektime){
        await extractor.seek(seektime);
    }
    return extractor.getFrame();
}

class VideoFrameExtractor{
    private backgroundVideo: HTMLVideoElement;
    private loadedPromise: Promise<void>;
    private loadedResolve;
    private loadedReject;

    private seekedPromise: Promise<void> = this.seekedPromise = new Promise(resolve => resolve());;
    private seekedResolve = () => {};
    private seekedReject = (reason?:any) => {};

    constructor(public url:string) {
        this.loadedPromise = new Promise((resolve, reject) =>{
            this.loadedResolve = resolve;
            this.loadedReject = reject;
        });
        
        this.backgroundVideo = document.createElement('video');
        this.backgroundVideo.crossOrigin = 'anonymous';
        this.backgroundVideo.addEventListener('loadeddata', (ev) => this.loadedResolve(), false);
        this.backgroundVideo.addEventListener('seeked',(ev) => this.seekedResolve(), false);
        this.backgroundVideo.addEventListener('error', (ev) => {
            this.loadedReject(ev.error);
            this.seekedReject(ev.error);
        }, false);
        
        this.backgroundVideo.preload = 'auto';
        this.backgroundVideo.src = url;        
    }

    public async seek(seconds){
        await this.loadedPromise;
        this.seekedPromise = new Promise((resolve, reject) =>{
            this.seekedResolve = resolve;
            this.seekedReject = reject;
        });
        this.backgroundVideo.currentTime = seconds;
        return this.seekedPromise;
    }

     public async getFrame(){
        await this.loadedPromise;

        let c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        c.width = this.backgroundVideo.videoWidth;
        c.height = this.backgroundVideo.videoHeight;
        ctx.drawImage(this.backgroundVideo, 0, 0, c.width, c.height);
        return c.toDataURL();
    }
}

window.devicePixelRatio = 1;
console.log(imgPath);

let gamingTrendLogo = convertURIToImageData(imgPath);

function draw(input: ThumbnailGenInput){
console.log('draw called', input);

let ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.drawImage(input.backgroundImage,0,0,canvas.width, canvas.height);

drawOverlay(ctx);

    if(input.description){
        drawDescription(ctx, input.description);
    }
    if(input.subText) {
        drawSubText(ctx, input.subText);
    }
    gamingTrendLogo.then(gtImage => canvas.getContext("2d").drawImage(gtImage, 20, 590));
};

// var backgroundImage = new Image;
// backgroundImage.addEventListener("load", function () {
//     draw({backgroundImage, description, subText});
// });
// backgroundImage.setAttribute('src', backgroundImagePath);

document.getElementById('redraw').onclick = () => {
    var desc = (document.getElementById('description') as HTMLInputElement ).value || description;
    var sub = (document.getElementById('subtext') as HTMLInputElement ).value || subText;
    var youtubeUrl = (document.getElementById('youtubeurl') as HTMLInputElement).value || undefined;
    if(youtubeUrl){
        let youtubeInfo = YoutubeVideo.parseYoutubeUrl(youtubeUrl);
        getVideoFrame(youtubeInfo.id, youtubeInfo.seconds)
        .then(convertURIToImageData)
        .then(backgroundImage => draw({description:desc, subText:sub, backgroundImage}));
    } else {
        backgroundImagePromise.then(backgroundImage => draw({description:desc, subText: sub, backgroundImage}));
    }
};

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
    
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
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
    // ctx.fillText(desc, 154, 686);
    ctx.fillText(desc, 154, 680);

    canvas.style.letterSpacing = oldLetterSpacing;  
}

async function convertURIToImageData(URI) {
    return new Promise<HTMLImageElement>(function(resolve, reject) {
      if (URI == null) return reject();    
          var image = new Image();
      image.addEventListener('load', function() {   
        resolve(image);
      }, false);
      image.setAttribute('src', URI);
    });
  }

interface ThumbnailGenInput{
    backgroundImage?: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement | ImageBitmap;
    description?: string;
    subText?: string;
}