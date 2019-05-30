import { convertURIToImageData } from './ImageUtil';
import { ThumbnailGenerator } from './ThumbnailGenerator';


let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let thumbnailGenerator = new ThumbnailGenerator(canvas);
let body = document.body;
let backgroundImage = document.getElementById('background-image') as HTMLCanvasElement;
let backgroundImagePromise: Promise<HTMLImageElement> = Promise.reject('No background image specified');

document.getElementById('redraw').onclick = () => {
    var desc = (document.getElementById('description') as HTMLInputElement).value;
    var sub = (document.getElementById('subtext') as HTMLInputElement).value;

    if(!desc){
        alert('Description must be specified.');
        return;
    }

    if(!sub){
        alert('Subtext must be specified.');
        return;
    }

    backgroundImagePromise
        .then(backgroundImage => thumbnailGenerator.draw({ description: desc, subText: sub, backgroundImage }))
        .catch(alert);
};

document.body.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];

    document.getElementById('dropPreview')
        .innerHTML = `Background Image: ${file.name} - type:${file.type} - size ${file.size}B`;
    console.info('dropped file detected', file);

    backgroundImagePromise = readImageFile(file);
});

function setBackgroundImageSrc(image) {
    console.info('setting background image', image);
    backgroundImage.setAttribute('src', image);
    return image;
}

function readImageFile(file: File): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                setBackgroundImageSrc(reader.result);
                resolve(convertURIToImageData(reader.result));
            }
            else {
                console.error('reader result is not a string', reader.result);
                reject('Unable to read the specified image file');
            }
        };
        reader.readAsDataURL(file);
    });
}

body.addEventListener('paste', (ev: ClipboardEvent) => {
    let clipboardData = ev.clipboardData;
    if (clipboardData.items.length) {
        let firstItem = clipboardData.items[0];
        if (firstItem.kind === 'file' && firstItem.type.startsWith('image')) {
            var file = clipboardData.items[0].getAsFile();
            backgroundImagePromise = readImageFile(file);
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