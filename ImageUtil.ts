export async function convertURIToImageData(URI: string) {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        if (URI == null) {
            return reject();
        }
        var image = new Image();
        image.addEventListener('load', function () {
            resolve(image);
        }, false);
        //TODO reject on 'error' event?
        image.setAttribute('src', URI);
    });
}