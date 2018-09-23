export class YoutubeVideo{
    public static getVideoInfo(id){
        return fetch("https://www.youtube.com/get_video_info?video_id="+id, {"credentials":"omit","headers":{},"referrer":"http://localhost:8000/test.html","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
        .then(response => {
            if(!response.ok ){
                throw new Error("Unable to complete request");
            }
            return response.text();
        }).then(video_info =>{
            var video;
            video = this.decodeQueryString(video_info);
            if (video.status === "fail") {
             return video;
            }
            video.sources = this.decodeStreamMap(video.url_encoded_fmt_stream_map);
            video.getSource = function(type, quality) {
            var exact, key, lowest, source, _ref;
            lowest = null;
            exact = null;
            _ref = this.sources;
            for (key in _ref) {
                source = _ref[key];
                if (source.type.match(type)) {
                if (source.quality.match(quality)) {
                    exact = source;
                } else {
                    lowest = source;
                }
                }
            }
            return exact || lowest;
            };
            return video;
        });

    }

    private static decodeQueryString(queryString:string) {
      var key, keyValPair, keyValPairs, r, val, _i, _len;
      r = {};
      keyValPairs = queryString.split("&");
      for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
        keyValPair = keyValPairs[_i];
        key = decodeURIComponent(keyValPair.split("=")[0]);
        val = decodeURIComponent(keyValPair.split("=")[1] || "");
        r[key] = val;
      }
      return r;
    }

    private static decodeStreamMap(url_encoded_fmt_stream_map) {
      var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
      sources = {};
      _ref = url_encoded_fmt_stream_map.split(",");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        urlEncodedStream = _ref[_i];
        stream = this.decodeQueryString(urlEncodedStream);
        type = stream.type.split(";")[0];
        quality = stream.quality.split(",")[0];
        stream.original_url = stream.url;
        stream.url = "" + stream.url + "&signature=" + stream.sig;
        sources["" + type + " " + quality] = stream;
      }
      return sources;
    }

    public static parseYoutubeUrl(url:string){
        let res = /https:\/\/youtu\.be\/([^\?]*)(\?t=)?(.*)?/.exec(url);
        let id=undefined;
        let timeString = undefined;
        if(res){
            id = res[1];
            timeString = res[3];
        } else {
            res = /https:\/\/www\.youtube\.com\/watch\?v=([^&]*)(&t=)?(.*)/.exec(url);
            if(res){
                id=res[1];
                timeString = res[3];
            }
        }
        return {id, seconds: this.timestringToSeconds(timeString)};
    }

    private static timestringToSeconds(timeString){
        if(!timeString){
         return 0;
        }

        var hours = timeString.match(/(\d)+h/); 
        var minutes = timeString.match(/(\d)+m/);
        var seconds = timeString.match(/(\d)+s/);
    
        var totalTimeInSeconds = 0;
        
        if (hours) {
        hours = hours[0].replace("h","");
        totalTimeInSeconds += hours * 60 * 60;
        }
        
        if (minutes) {
            minutes = minutes[0].replace("m","");
            totalTimeInSeconds += minutes * 60;
        }
        
        if (seconds) {
        seconds = seconds[0].replace("s","")
        totalTimeInSeconds += seconds * 1;
        }
        return totalTimeInSeconds;
    }
  }