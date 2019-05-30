export async function convertURIToImageData(URI: string) {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        var image = new Image();
        image.addEventListener('load', function () {
            resolve(image);
        });
        
        image.addEventListener('error', function(ev:ErrorEvent){
            reject(ev.error);
        });

        image.setAttribute('src', URI);
    });
}