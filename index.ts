import {convertURIToImageData} from './ImageUtil';
import { YoutubeVideo } from './youtube-video';
import {ThumbnailGenerator} from './ThumbnailGenerator';


let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let thumbnailGenerator = new ThumbnailGenerator(canvas);


var urls = ['https://youtu.be/X_Ch70KkMtE?t=2m57s', 'https://youtu.be/X_Ch70KkMtE', 'https://www.youtube.com/watch?v=X_Ch70KkMtE', 'https://www.youtube.com/watch?v=X_Ch70KkMtE&t=2m57s'];
urls.forEach(u => console.log(u, YoutubeVideo.parseYoutubeUrl(u)));

let body = document.body;



interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

function getAdjustmentForImageAndCanvas(imageRect: Rect, canvasRect: Rect): { source: Rect, destination: Rect } {
    if (imageRect.width === canvasRect.width && imageRect.height === canvasRect.height) {
        return {
            source: { ...imageRect },
            destination: { ...imageRect }
        };
    }
    //example time ... 10x5 going into 10x10
    // scale image by 2 to 20x10 into 10x10
    //
    return {
        source: { x: 0, y: 0, width: 0, height: 0 },
        destination: { x: 0, y: 0, width: 0, height: 0 }
    };
}

// let backgroundImagePromise: Promise<HTMLImageElement>  = new Promise((resolve,reject) => reject('No Background Image specified'));
let backgroundImagePromise: Promise<HTMLImageElement> | undefined = undefined;

let description = 'Holly Saves Time' //'Naval Combat and Recruiting';
let subText = "Wow this is awesome, I can't believe it"//"Assasin's Creed Odyssey - PC - 4K Max Settings";

document.body.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    

    document.getElementById('dropPreview')
        .innerHTML = `Background Image: ${file.name} - type:${file.type} - size ${file.size}B`;
    console.info('dropped file detected', file);

    readImageFile(file);
})

function readImageFile(file: File) {
    var reader = new FileReader();
    reader.onload = function (e) {
        if (typeof reader.result === 'string') {
            backgroundImagePromise = convertURIToImageData(reader.result);
        }
        else {
            //TODO reject 
            console.error('reader result is not a string', reader.result);
        }
    };
    reader.readAsDataURL(file);
}

async function getVideoUrl(videoId) {
    return YoutubeVideo.getVideoInfo(videoId)
        .then((video) => {
            console.log('video', video);
            console.log('hd stream', video.getSource('mp4', 'hd720'));
            let videoSource = video.getSource('mp4', 'hd720');
            let videoUrl = videoSource.url;
            if (!videoUrl) {
                throw new Error('Unable to attain video url');
            }
            return videoUrl;
        })
        .catch(error => console.log('Error', error));
}

async function getVideoFrame(videoId, seektime?: number) {
    let url = await getVideoUrl(videoId);
    let extractor = new VideoFrameExtractor(url);
    if (seektime) {
        await extractor.seek(seektime);
    }
    return extractor.getFrame();
}

class VideoFrameExtractor {
    private backgroundVideo: HTMLVideoElement;
    private loadedPromise: Promise<void>;
    private loadedResolve;
    private loadedReject;

    private seekedPromise: Promise<void> = this.seekedPromise = new Promise(resolve => resolve());;
    private seekedResolve = () => { };
    private seekedReject = (reason?: any) => { };

    constructor(public url: string) {
        this.loadedPromise = new Promise((resolve, reject) => {
            this.loadedResolve = resolve;
            this.loadedReject = reject;
        });

        this.backgroundVideo = document.createElement('video');
        this.backgroundVideo.crossOrigin = 'anonymous';
        this.backgroundVideo.addEventListener('loadeddata', (ev) => this.loadedResolve(), false);
        this.backgroundVideo.addEventListener('seeked', (ev) => this.seekedResolve(), false);
        this.backgroundVideo.addEventListener('error', (ev) => {
            this.loadedReject(ev.error);
            this.seekedReject(ev.error);
        }, false);

        this.backgroundVideo.preload = 'auto';
        this.backgroundVideo.src = url;
    }

    public async seek(seconds) {
        await this.loadedPromise;
        this.seekedPromise = new Promise((resolve, reject) => {
            this.seekedResolve = resolve;
            this.seekedReject = reject;
        });
        this.backgroundVideo.currentTime = seconds;
        return this.seekedPromise;
    }

    public async getFrame() {
        await this.loadedPromise;

        let c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        c.width = this.backgroundVideo.videoWidth;
        c.height = this.backgroundVideo.videoHeight;
        ctx.drawImage(this.backgroundVideo, 0, 0, c.width, c.height);
        return c.toDataURL();
    }
}

// var backgroundImage = new Image;
// backgroundImage.addEventListener("load", function () {
//     draw({backgroundImage, description, subText});
// });
// backgroundImage.setAttribute('src', backgroundImagePath);

document.getElementById('redraw').onclick = () => {
    var desc = (document.getElementById('description') as HTMLInputElement).value || description;
    var sub = (document.getElementById('subtext') as HTMLInputElement).value || subText;
    var youtubeUrl = (document.getElementById('youtubeurl') as HTMLInputElement).value || undefined;
    if (youtubeUrl) {
        let youtubeInfo = YoutubeVideo.parseYoutubeUrl(youtubeUrl);
        getVideoFrame(youtubeInfo.id, youtubeInfo.seconds)
            .then(convertURIToImageData)
            .then(backgroundImage => thumbnailGenerator.draw({ description: desc, subText: sub, backgroundImage }));
    } else {
        backgroundImagePromise.then(backgroundImage => thumbnailGenerator.draw({ description: desc, subText: sub, backgroundImage }));
    }
};

body.addEventListener('paste', (ev: ClipboardEvent) => {
    let clipboardData = ev.clipboardData;
    if (clipboardData.items.length) {
        let firstItem = clipboardData.items[0];
        if (firstItem.kind === 'file' && firstItem.type.startsWith('image')) {
            var file = clipboardData.items[0].getAsFile();
            readImageFile(file);
        } else if (firstItem.kind === 'string') {
            clipboardData.items[0].getAsString((str) => {
                console.log('clipboard paste as string', str);
            });
        } else {
            console.error(`unrecognized item type of ${firstItem.kind}`);
        }
    } else {
        console.error('Nothing found on clipboard, if you are trying to paste a file, drag/drop instead');
    }
});