export async function convertURIToImageData(URI: string) {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        if (URI == null) {
            return reject();
        }
        var image = new Image();
        image.addEventListener('load', function () {
            resolve(image);
        }, false);
        image.setAttribute('src', URI);
    });
}