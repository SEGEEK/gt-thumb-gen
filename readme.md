# What does this do?
This uses an html5 canvas to generate a thumbnail graphic suitable for use on gaming trends youtube videos.  The goal was to make it easier to generate these images and avoid messing with photoshop.

Try it out!  https://segeek.github.io/gt-thumb-gen/
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
    1. Extract Dom pieces away from canvas generation code.
    1. Move interfaces/classes into their own files.
 1. Could use some test code
 1. Potentially make a library around some of the functionality (I stole the youtubeVideo code from some old project that was originally in coffee script)

 # License
 Do what you want but you are on your own license.  Feel free to use this code, probably shouldn't run nuclear power plants with it but hey I am not here to tell you what to do.  Either way, have fun but don't blame me if you cause an international incident or cause.