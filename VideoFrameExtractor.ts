export class VideoFrameExtractor {
    private backgroundVideo: HTMLVideoElement;
    private loadedPromise: Promise<void>;
    private loadedResolve;
    private loadedReject;
    private seekedPromise: Promise<void> = this.seekedPromise = new Promise(resolve => resolve());
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
        console.log('getting frame', c);
        ctx.drawImage(this.backgroundVideo, 0, 0, c.width, c.height);
        return c.toDataURL();
    }
}
