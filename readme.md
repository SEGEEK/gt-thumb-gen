# What does this do?
This uses an html5 canvas to generate a thumbnail graphic suitable for use on gaming trends youtube videos.  The goal was to make it easier to generate these images and avoid messing with photoshop.

Try it out!  https://segeek.github.io/gt-thumb-gen/

## Why would you unleash this monstrosity upon the world?
Been playing with HTML canvas stuff at work on some hack day projects, my wife is generating these things by hand using a photoshop template and it seems like too much of a hassel for me.  I wanted to play around to see how hard it would be to extract a video frame and put it into a canvas at an arbitrary time stamp.  Turns out it is pretty easy ... until the dreaded CORS rears its ugly head.

Also been wanting to check out [github pages](https://pages.github.com/) for a while, and do a side project using [parcel](https://parceljs.org/)

## But why a canvas it is much easier to just draw stuff on dom and use some CSS
I tried to get [dom-to-image](https://github.com/tsayen/dom-to-image#readme) to work, but unfortuantely I was running into issues with the text being very blurry.  I am apparently not the only one [to experience this issue](https://github.com/tsayen/dom-to-image/issues/69).  Would be nice to see if that would be workable ... but working in Canvas isn't so bad.

## Credits
Special thanks to [Bertrand Martel](https://github.com/bertrandmartel) for an [Excellent Answer](https://stackoverflow.com/a/43012205) on stack overflow (With running code sample!) on how to do something very similiar to what I wanted.

Also big thanks to [Endless Hack](https://github.com/endlesshack) for an [useful bit of code](https://github.com/endlesshack/youtube-video) that finds information out about a youtube video.  Looks like the primary contributer there is [Johannes Wagener](https://github.com/jwagener), thanks Johannes!

Would also like to thank [Dave Geddes](https://twitter.com/geddski) for a technique for testing layout changes against another image by overlaying your html over an transparent image of what you want to create.  Check out that video [here](https://gedd.ski/build/overwatch-hero-picker/), that was great for making sure my font size/positioning matched exactly the reference image I was comparing to.

Last but not least the fine folks at html5rocks.com.  They have a bevy of useful [tutorials](https://www.html5rocks.com/en/tutorials/canvas/texteffects/#toc-text-shadows) about how to do fancy things with the canvas element.

# The Build
Typical node stuff, you will need a version of node 8+ range is fine.

```
git clone https://github.com/SEGEEK/gt-thumb-gen.git
cd gt-thumb-gen
npm install
npm run dev
```

When you are wanting to publish something do a full build ...
```
npm run clean
npm run build
git push origin
```

The github pages setup has things looking at the master branch/docs folder so that is where I put the build output.  This is silly but hey free hosting ... so I am willing to be a little bit silly.

# Current Issues:
1. Cannot do a proper production build if we are referencing the stylesheet in index.html.  It works in dev but for the prod build we get some obsure error about some library not being found.  Hopefully this is just a parcel issue that will be cleared up in a new version.
1. Also I am encouraging folks to do a terrible thing with a chrome extension to bypass youtube's silly no cors settings.  This is a bit clunky but it is nice to make things easier if you know the frame of a youtube video you would like to be the background for the thumbnail.

## TODO:
 1. Needs some code cleanup (right now index.ts is a tangled mess, need to extract the pieces used to generate the thumbnail away from the dom)
    1. Extract Dom pieces away from canvas generation code (✓).
    1. Move interfaces/classes into their own files.
 1. Get some proper image scaling ... right now I don't scale while preserving aspect ratio because it is late at night and my brain is not in the mood to math.  Plus I blame the clunky `Context2D.fillImage(...)` interface, perhaps there is an easier way to do what I want by modifying the 'Image' I am creating.
 1. Could use some test code.
 1. Potentially make a library around some of the functionality (I stole the youtubeVideo code from https://github.com/endlesshack/youtube-video and ported it to typescript).  It may be handy for other folks to use, although with the CORS issues I ran into I am not sure how useful it would be, or if others are willing to sink to my depths.  (Perhaps a CORS proxy like https://cors.io/ can help here ...)
    1. Move the youtube extra instructions so they are less prominent since this is a less common use case.
    1. Clean up usage instructions related to this, can do my own pre-flight check to see if the extension has been set up or not.  
    1. Add a reminder to turn off extension after the image is generated.

 # License
 Do what you want but you are on your own license.  Feel free to use this code, probably shouldn't run nuclear power plants with it but hey I am not here to tell you what to do.  Either way, have fun but don't blame me if you cause an international incident or a reactor meltdown.