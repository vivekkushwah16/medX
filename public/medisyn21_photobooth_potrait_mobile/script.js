/*
 * Photobooth
 * Ramon Morcillo @reymon359
 * ramonmorcillo.com
 */
// const video = document.querySelector('.player');
// const canvas = document.querySelector('.photo');

function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}
const video = document.querySelector(".player");
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");

const canvas = document.querySelector(".photo");

const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const mobile = isMobile();

//const alphaNumber = document.querySelector('.alphaContainer input');
var ratio = window.devicePixelRatio || 1;
var Pause;
var frame = new Image();
frame.crossOrigin = "anonymous";
if (mobile) {
  // console.log("Yes. I am mobile");
  frame.src = "img/framemobile.png";
  const VIDEO_WIDTH = 1080;
  const VIDEO_HEIGHT = 1920;
} else {
  frame.src = "img/framenew.png";
}
let midPanel = document.getElementById("body");
var Retake = document.getElementById("Retake");
Retake.style.display = "none";
var Save = document.getElementById("Save");
Save.style.display = "none";
var Capture = document.getElementById("Capture");
Capture.style.display = "block";
var eid = "djunknown@digialjalebi.com";
var counter = 0;

//add constraints object
var constraints = {
  audio: true,
  video: true,
};

let firebaseConfig = {
  apiKey: "AIzaSyBjSPRUgzyQhITpWHb9FdzMMuLS45Zsd9s",
  authDomain: "cipla-impact.firebaseapp.com",
  databaseURL: "https://cipla-impact-default-rtdb.firebaseio.com",
  projectId: "cipla-impact",
  storageBucket: "cipla-impact.appspot.com",
  messagingSenderId: "1009487366735",
  appId: "1:1009487366735:web:1d55b85d23d818bcac383a",
  measurementId: "G-JJY7JWKTV3"
};
// Initialize Firebase

const urlQuery = new URLSearchParams(window.location.search);
let eventId = urlQuery.get("eventId");


firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const auth = firebase.auth();

auth.onAuthStateChanged(function (user) {
  if (user) {
    console.log(user.email + " Signed In");
    eid = user.email;
  } else {
    console.log("Nobody is Signed In");
    eid = "guest14@event.com";
    auth
      .signInWithEmailAndPassword(
        "guest14@event.com",
        "guest14@event.com123456"
      )
      .then((cred) => {
        console.log(cred.user);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "user",
        // Only setting the video to a specified size in order to accommodate a
        // point cloud, so on mobile devices accept the default size.
        width: mobile ? undefined : VIDEO_WIDTH,
        height: mobile ? undefined : VIDEO_HEIGHT,

        //  width: mobile ? VIDEO_WIDTH : VIDEO_WIDTH,
        //  height: mobile ? VIDEO_HEIGHT : VIDEO_HEIGHT
        // width: mobile ? screen.width*ratio :VIDEO_WIDTH,
        // height: mobile ? screen.height*ratio :VIDEO_HEIGHT
        // width: mobile ? midPanel.width : VIDEO_WIDTH,
        // height: mobile ? midPanel.height : VIDEO_HEIGHT
      },
      audio: false,
    })
    .then((localMediaStream) => {
      console.log(localMediaStream);

      //  DEPRECIATION :
      //       The following has been depreceated by major browsers as of Chrome and Firefox.
      //       video.src = window.URL.createObjectURL(localMediaStream);
      //       Please refer to these:
      //       Depreceated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject

      if ("srcObject" in video) {
        try {
          video.srcObject = localMediaStream;
        } catch (err) {
          if (err.name != "TypeError") {
            throw err;
          }
          // Even if they do, they may only support MediaStream
          video.src = URL.createObjectURL(localMediaStream);
        }
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = URL.createObjectURL(localMediaStream);
      }
      video.addEventListener("loadedmetadata", () =>
        paintToCanvas("loadMetaData")
      );
      video.load();
      // video.srcObject = localMediaStream;

      video.play();
      // if(mobile)
      // {
      //   frame.src="img/FrameP.png";
      // }
      // else{
      //   frame.src="img/frame.png";
      // }
    })
    .catch((err) => {
      console.error(`OH NO!!!`, err);
    });

  //  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
  //         video.srcObject = stream;
  //         video.play();
  //     });
  //   }
}

$(window).resize(function () {
  //getVideo();
  //this.location.reload();
  //resizeFunc();
  // this.console.log("Resize");
});

window.addEventListener("orientationchange", function () {
  this.location.reload();
});

var gotFirst = true;

function paintToCanvas(type) {
  console.log(type + "xxxxxxxxxxxx");

  if (!gotFirst) {
    return;
  }
  gotFirst = false;
  console.log("xxxxxxxxxxxx" + type);

  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width + "X" + height);
  // alert(width + "X" + height);
  let w = 0,
    h = 0;

  if (width > height) {
    console.log("PC");
  } else if (width < height) {
    console.log("Mobile");
  } else {
    console.log("Other");
  }

  let reObj = calculateAspectRatioFit(width, height, 731, 472);
  if (mobile) {
    reobj = calculateAspectRatioFit(width, height, 731, 472);
  }
  console.log(reObj);
  // canvas.width = w;
  // canvas.height = h;

  canvas.width = 1920;
  canvas.height = 1080;

  if (mobile) {
    canvas.width = 1080;
    canvas.height = 1920;
  }

  console.log(canvas.width);
  return setInterval(() => {
    if (!Pause) {
      //console.log("This is working");
      ctx.scale(-1, 1);

      let findExtaW = (731 - reObj.width) / 2;
      let findExtaH = (472 - reObj.height) / 2;
      ctx.drawImage(frame, 0, 0, frame.width, frame.height);
      if (mobile) {
        //Change

        var pos_x = 174;
        var pos_y = 315;
        var width = 730;
        var height = 1347;

        var radius = 400;
        ctx.save();

        ctx.beginPath();
        // ctx.arc(539, 1095, 360, 0, 2 * Math.PI);
        // ctx.fillStyle = "#fff";
        // ctx.fill();
        // ctx.clip();
        // ctx.rect(pos_x, pos_y, 620, 775);
        // ctx.fillStyle = 'orange'//"#f5c043";
        // ctx.fill();
        // ctx.arc(pos_x + radius, pos_y + radius, radius, 0, Math.PI * 2, true);
        // ctx.closePath();
        // ctx.clip();
        roundedImage(pos_x, pos_y, width, height, 20);
        ctx.clip();
        ctx.drawImage(video, pos_x, pos_y, width, height);

        // ctx.drawImage(video, pos_x, pos_y, reObj.width * 2, reObj.height * 1.65);

        // ctx.beginPath();
        // ctx.rect(0, 937, 260, reObj.height * 0.175);
        // ctx.rect(790, 936, 110, reObj.height * 0.175);
        // ctx.fillStyle = "#f5c043";
        // ctx.fill();
        // ctx.closePath();

        // ctx.beginPath();
        // ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
        // ctx.clip();
        ctx.closePath();
        ctx.restore();

        // ctx.drawImage(video, -50 + findExtaW, 349 + findExtaH, reObj.width+449, reObj.height+572);
      } else {
        // ctx.fillRect(569, 256, 732, 473);

        // ctx.beginPath();
        // ctx.arc(500, 500, 250, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.drawImage(video, 350 + findExtaW, 147 + findExtaH, reObj.width*1.2, reObj.height*1.2);
        //Change
        var pos_x = 405;
        var pos_y = 376;
        var width = 1113;
        var height = 590;
        ctx.save();

        ctx.beginPath();
        roundedImage(pos_x, pos_y, width, height, 8);

        // ctx.lineJoin = "round";
        // ctx.lineWidth = 10;
        // ctx.fillStyle = "#fff";
        // ctx.strokeStyle = "#fff";
        // ctx.strokeRect(pos_x, pos_y, 895, 500);
        // ctx.rect(pos_x, pos_y, 895, 500)

        // var radius = 5;
        // ctx.arc(603, 540, 306, 0, 2 * Math.PI);
        // ctx.arc(pos_x + radius, pos_y + radius, radius, 0, Math.PI * 2, true);
        // ctx.rect(pos_x, pos_y, reObj.width * 1.4, reObj.height * 1.4)
        // ctx.fillStyle = "#ffbd04";
        // ctx.fill();
        ctx.clip();
        // ctx.closePath();

        // ctx.drawImage(video, pos_x, pos_y, 2*radius+2, 2*radius+2);
        // console.log("w"+reObj.width);
        // console.log("h"+reObj.height);
        ctx.drawImage(video, pos_x, pos_y, width, height);

        // ctx.drawImage(video, pos_x, pos_y, reObj.width * 1.20, reObj.height * 1.2);
        // ctx.drawImage(video,454+260-365,175+260-205,reObj.width*1.2,reObj.height*1.2);

        // ctx.beginPath();
        // ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
        // ctx.clip();
        // ctx.closePath();

        // ctx.beginPath();
        // ctx.rect(0, 437, reObj.width * 0.7, reObj.height * 0.35);
        // ctx.rect(1440, 437, 105, reObj.height * 0.35);
        // ctx.fillStyle = "#ffbd04";
        // ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
      // if(width > height){

      //   ctx.drawImage(video,(width/2)/2,0,w,h,0,0,-w,h);

      // }else if(width < height){

      //   ctx.drawImage(video,0,(height/2)/2,w,h,0,0,-w,h);

      // }else{

      //   ctx.drawImage(video,0,0,w,h,0,0,-w,h);
      // }

      // ctx.drawImage(video,0,0,w,h,0,0,-w,h);

      //  ctx.scale(-1, 1);
    }
  }, 16);
}

function roundedImage(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  };
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();
  console.log("This is Working");
  Capture.style.display = "none";
  Save.style.display = "block";
  Retake.style.display = "block";
  Pause = true;
  // take the data out of the canvas
  // const data = canvas.toDataURL('image/jpeg');
  // const link = document.createElement('a');
  // link.href = data;
  // link.setAttribute('download','awesome');
  // link.innerHTML = `<img src="${data}" alt="Awesome photo" />`;
  // strip.insertBefore(link, strip.firstChild);
  // var img    = canvas.toDataURL("image/png");
  // document.write('<img src="'+img+'"/>');
}

function limit() {
  if (counter < 3) {
    document.getElementById("a").innerHTML += " ";
    console.log(counter);
    counter++;
  } else {
    console.log(counter);
    document.getElementById("id").disabled = true;
  }
}

function UploadImage(file) {
  // File or Blob named mountains.jpg
  // var data =canvas.toDataURL("image/png");
  // console.log(data);
  // var metadata = {
  //   contentType: 'image/jpeg'
  // };

  return new Promise((res, rej) => {
    try {
      var date = new Date();
      var timestamp = date.getTime();

      var storageRef = storage.ref(
        "phootobooth/"+ eventId + "/" + eid + "_" + timestamp + ".jpeg"
      );

      var task = storageRef.put(file);

      task.on(
        "state_changed",
        function progress(snapshot) {},
        function error(er) {
          console.log(er.code);
          // window.location.reload();
        },
        function complete() {
          console.log("complete");
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
            res();
            // window.location.reload();
          });
        }
      );
    } catch (error) {
      rej(error);
    }
  });
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type: contentType,
  });
  return blob;
}

getVideo();

video.addEventListener("canplay", () => paintToCanvas("canplay"));
video.addEventListener("seeked", () => paintToCanvas("seeked"));

const loader = document.querySelector("#blocker");

$("#Save").click(function () {
  canvas.toBlob(async function (blob) {
    loader.classList.remove("d-none");
    await UploadImage(blob);
    loader.classList.add("d-none");
    saveAs(blob, "img.png");
  });
});

//////////////////////////////////////
// FileSaver scripts
//////////////////////////////////////

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2014-08-29
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs =
  saveAs ||
  // IE 10+ (native saveAs)
  (typeof navigator !== "undefined" &&
    navigator.msSaveOrOpenBlob &&
    navigator.msSaveOrOpenBlob.bind(navigator)) ||
  // Everyone else
  (function (view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (
      typeof navigator !== "undefined" &&
      /MSIE [1-9]\./.test(navigator.userAgent)
    ) {
      return;
    }
    var doc = view.document,
      // only get URL when necessary in case Blob.js hasn't overridden it yet
      get_URL = function () {
        return view.URL || view.webkitURL || view;
      },
      save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
      can_use_save_link = "download" in save_link,
      click = function (node) {
        var event = doc.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          view,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        node.dispatchEvent(event);
      },
      webkit_req_fs = view.webkitRequestFileSystem,
      req_fs =
        view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
      throw_outside = function (ex) {
        (view.setImmediate || view.setTimeout)(function () {
          throw ex;
        }, 0);
      },
      force_saveable_type = "application/octet-stream",
      fs_min_size = 0,
      // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 for
      // the reasoning behind the timeout and revocation flow
      arbitrary_revoke_timeout = 10,
      revoke = function (file) {
        var revoker = function () {
          if (typeof file === "string") {
            // file is an object URL
            get_URL().revokeObjectURL(file);
          } else {
            // file is a File
            file.remove();
          }
        };
        if (view.chrome) {
          revoker();
        } else {
          setTimeout(revoker, arbitrary_revoke_timeout);
        }
      },
      dispatch = function (filesaver, event_types, event) {
        event_types = [].concat(event_types);
        var i = event_types.length;
        while (i--) {
          var listener = filesaver["on" + event_types[i]];
          if (typeof listener === "function") {
            try {
              listener.call(filesaver, event || filesaver);
            } catch (ex) {
              throw_outside(ex);
            }
          }
        }
      },
      FileSaver = function (blob, name) {
        // First try a.download, then web filesystem, then object URLs
        var filesaver = this,
          type = blob.type,
          blob_changed = false,
          object_url,
          target_view,
          dispatch_all = function () {
            dispatch(
              filesaver,
              "writestart progress write writeend".split(" ")
            );
          },
          // on any filesys errors revert to saving with object URLs
          fs_error = function () {
            // don't create more object URLs than needed
            if (blob_changed || !object_url) {
              object_url = get_URL().createObjectURL(blob);
            }
            if (target_view) {
              target_view.location.href = object_url;
            } else {
              var new_tab = view.open(object_url, "_blank");
              if (new_tab == undefined && typeof safari !== "undefined") {
                //Apple do not allow window.open, see http://bit.ly/1kZffRI
                view.location.href = object_url;
              }
            }
            filesaver.readyState = filesaver.DONE;
            dispatch_all();
            revoke(object_url);
          },
          abortable = function (func) {
            return function () {
              if (filesaver.readyState !== filesaver.DONE) {
                return func.apply(this, arguments);
              }
            };
          },
          create_if_not_found = {
            create: true,
            exclusive: false,
          },
          slice;
        filesaver.readyState = filesaver.INIT;
        if (!name) {
          name = "download";
        }
        if (can_use_save_link) {
          object_url = get_URL().createObjectURL(blob);
          save_link.href = object_url;
          save_link.download = name;
          click(save_link);
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
          revoke(object_url);
          return;
        }
        // Object and web filesystem URLs have a problem saving in Google Chrome when
        // viewed in a tab, so I force save with application/octet-stream
        // http://code.google.com/p/chromium/issues/detail?id=91158
        // Update: Google errantly closed 91158, I submitted it again:
        // https://code.google.com/p/chromium/issues/detail?id=389642
        if (view.chrome && type && type !== force_saveable_type) {
          slice = blob.slice || blob.webkitSlice;
          blob = slice.call(blob, 0, blob.size, force_saveable_type);
          blob_changed = true;
        }
        // Since I can't be sure that the guessed media type will trigger a download
        // in WebKit, I append .download to the filename.
        // https://bugs.webkit.org/show_bug.cgi?id=65440
        if (webkit_req_fs && name !== "download") {
          name += ".download";
        }
        if (type === force_saveable_type || webkit_req_fs) {
          target_view = view;
        }
        if (!req_fs) {
          fs_error();
          return;
        }
        fs_min_size += blob.size;
        req_fs(
          view.TEMPORARY,
          fs_min_size,
          abortable(function (fs) {
            fs.root.getDirectory(
              "saved",
              create_if_not_found,
              abortable(function (dir) {
                var save = function () {
                  dir.getFile(
                    name,
                    create_if_not_found,
                    abortable(function (file) {
                      file.createWriter(
                        abortable(function (writer) {
                          writer.onwriteend = function (event) {
                            target_view.location.href = file.toURL();
                            filesaver.readyState = filesaver.DONE;
                            dispatch(filesaver, "writeend", event);
                            revoke(file);
                          };
                          writer.onerror = function () {
                            var error = writer.error;
                            if (error.code !== error.ABORT_ERR) {
                              fs_error();
                            }
                          };
                          "writestart progress write abort"
                            .split(" ")
                            .forEach(function (event) {
                              writer["on" + event] = filesaver["on" + event];
                            });
                          writer.write(blob);
                          filesaver.abort = function () {
                            writer.abort();
                            filesaver.readyState = filesaver.DONE;
                          };
                          filesaver.readyState = filesaver.WRITING;
                        }),
                        fs_error
                      );
                    }),
                    fs_error
                  );
                };
                dir.getFile(
                  name,
                  {
                    create: false,
                  },
                  abortable(function (file) {
                    // delete file if it already exists
                    file.remove();
                    save();
                  }),
                  abortable(function (ex) {
                    if (ex.code === ex.NOT_FOUND_ERR) {
                      save();
                    } else {
                      fs_error();
                    }
                  })
                );
              }),
              fs_error
            );
          }),
          fs_error
        );
      },
      FS_proto = FileSaver.prototype,
      saveAs = function (blob, name) {
        return new FileSaver(blob, name);
      };
    FS_proto.abort = function () {
      var filesaver = this;
      filesaver.readyState = filesaver.DONE;
      dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

    return saveAs;
  })(
    (typeof self !== "undefined" && self) ||
      (typeof window !== "undefined" && window) ||
      this.content
  );
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if (
  typeof define !== "undefined" &&
  define !== null &&
  define.amd != null
) {
  define([], function () {
    return saveAs;
  });
}

/* canvas-toBlob.js
 * A canvas.toBlob() implementation.
 * 2013-12-27
 *
 * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
 * License: X11/MIT
 *   See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
              plusplus: true */

/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

(function (view) {
  "use strict";
  var Uint8Array = view.Uint8Array,
    HTMLCanvasElement = view.HTMLCanvasElement,
    canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype,
    is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i,
    to_data_url = "toDataURL",
    base64_ranks,
    decode_base64 = function (base64) {
      var len = base64.length,
        buffer = new Uint8Array(((len / 4) * 3) | 0),
        i = 0,
        outptr = 0,
        last = [0, 0],
        state = 0,
        save = 0,
        rank,
        code,
        undef;
      while (len--) {
        code = base64.charCodeAt(i++);
        rank = base64_ranks[code - 43];
        if (rank !== 255 && rank !== undef) {
          last[1] = last[0];
          last[0] = code;
          save = (save << 6) | rank;
          state++;
          if (state === 4) {
            buffer[outptr++] = save >>> 16;
            if (last[1] !== 61 /* padding character */) {
              buffer[outptr++] = save >>> 8;
            }
            if (last[0] !== 61 /* padding character */) {
              buffer[outptr++] = save;
            }
            state = 0;
          }
        }
      }
      // 2/3 chance there's going to be some null bytes at the end, but that
      // doesn't really matter with most image formats.
      // If it somehow matters for you, truncate the buffer up outptr.
      return buffer;
    };
  if (Uint8Array) {
    base64_ranks = new Uint8Array([
      62,
      -1,
      -1,
      -1,
      63,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
    ]);
  }
  if (HTMLCanvasElement && !canvas_proto.toBlob) {
    canvas_proto.toBlob = function (callback, type /*, ...args*/) {
      if (!type) {
        type = "image/png";
      }
      if (this.mozGetAsFile) {
        callback(this.mozGetAsFile("canvas", type));
        return;
      }
      if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
        callback(this.msToBlob());
        return;
      }

      var args = Array.prototype.slice.call(arguments, 1),
        dataURI = this[to_data_url].apply(this, args),
        header_end = dataURI.indexOf(","),
        data = dataURI.substring(header_end + 1),
        is_base64 = is_base64_regex.test(dataURI.substring(0, header_end)),
        blob;
      if (Blob.fake) {
        // no reason to decode a data: URI that's just going to become a data URI again
        blob = new Blob();
        if (is_base64) {
          blob.encoding = "base64";
        } else {
          blob.encoding = "URI";
        }
        blob.data = data;
        blob.size = data.length;
      } else if (Uint8Array) {
        if (is_base64) {
          blob = new Blob([decode_base64(data)], {
            type: type,
          });
        } else {
          blob = new Blob([decodeURIComponent(data)], {
            type: type,
          });
        }
      }
      callback(blob);
    };

    if (canvas_proto.toDataURLHD) {
      canvas_proto.toBlobHD = function () {
        to_data_url = "toDataURLHD";
        var blob = this.toBlob();
        to_data_url = "toDataURL";
        return blob;
      };
    } else {
      canvas_proto.toBlobHD = canvas_proto.toBlob;
    }
  }
})(
  (typeof self !== "undefined" && self) ||
    (typeof window !== "undefined" && window) ||
    this.content ||
    this
);
