var recorder, video1, video2, v1_start_time, v2_start_time, v1_end_time, v2_end_time, stream_obj;
var recordedChunks = [];


function init() {

    video1 = document.getElementById('video1');
    video2 = document.getElementById('video2');

    v1_start_time = 0;
    v2_start_time = 0;
    v1_end_time = 10000;
    v2_end_time = 10000;

}

// Calles from the Open Video Button
function open_file(second) {

    init();

    //get the hidden <input type="file"> file loader element and force a click on it
    var loader = document.getElementById('file_loader_1');
    if(second){
        loader = document.getElementById('file_loader_2');
    }
    loader.click();

    //Now, as soon as the user selects the file, handle_files is calles automatically and we can work with the selected file
}

//Autocall function when the user finished selecting the file in the open file dialogue
function handle_files(file, second) {
    const vid = file[0].name;
    get_video(vid, second);
}

function use_webcam(second) {

    init();

    video = video1;
    if(second) {
        video = video2;
    }

    // Get access to the camera: if browser supports media divices then do ....
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // video:true is the only contraint we need, now the API returns a 
        // Media Stream which we can set as the source of the video object
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                stream_obj = stream;
                video.play();

                //we need to attatch the stream_obj that we just got to a 
                //MediaRecorder Object, so that we can use it to record the video later
                recorder = new MediaRecorder(stream, {
                     mimeType: 'video/webm; codecs=vp9'
                });

                recorder.ondataavailable = handleDataAvailable;
            })

            .catch(function(error){
                console.log("Something went wrong.");
            });

    }  
    enable_input_fields(second);
}




//This function is called from the auto handler after selecting the file, to now work with the selected file
function get_video(vid, second) {
    var source = document.createElement('source');

    //source.setAttribute('src', 'a1QnG8Y_460svvp9.webm');
    source.setAttribute('src', vid);

    //with cam stream only working if we use video here not with var video, but before this point video doesn't exist
    video = video1;
    if (second) {
        video = video2;
    }
    video.srcObject = null;
    video.appendChild(source);
    video.play();

    //add an update, as soon as the video is running loop is called constantly
    video.ontimeupdate = function() {loop(second)};
    /*setTimeout(function() {  
        video.pause();

        source.setAttribute('src', 'a1QnG8Y_460svvp9.webm'); 

        video.load();
        video.play();
    }, 10000);*/

    enable_input_fields(second);
}

function enable_input_fields(second) {
    //enable the input fields for start end end input of the loop after video is loaded now
    if (second) {
        document.getElementById('v2_start').disabled = false;
        document.getElementById('v2_end').disabled = false;
    } else {
        document.getElementById('v1_start').disabled = false;
        document.getElementById('v1_end').disabled = false;
    }

    /*video.controls.innerHTML =  '<button class="play">play</button>'+
                            '<div id="change">' +
                            '<button class="zoomin">+</button>' +
                            '<button class="zoomout">-</button>' +
                            '<button class="left">⇠</button>' +
                            '<button class="right">⇢</button>' +
                            '<button class="up">⇡</button>' +
                            '<button class="down">⇣</button>' +
                            '<button class="rotateleft">&#x21bb;</button>' +
                            '<button class="rotateright">&#x21ba;</button>' +
                            '<button class="reset">reset</button>' +
                          '</div>';*/
    
}





function play_pause_both_videos(){
    if (video1.paused || video2.paused) { 
        video1.play();
        video2.play();
        //document.getElementById("play_both").childNodes[0].nodeValue="Pause Both Videos";
    }
    else {
        video1.pause();
        video2.pause();
        //document.getElementById("play_both").childNodes[0].nodeValue="Play Both Videos";
    }

    //Now, let's also record the video from the web cam
    record_videos();
}


function record_videos() {

    //if recorder.state returns the string recording, the video is already being recorded
    if (recorder.state.localeCompare("recording")) {
        recorder.start();

    } else {
        recorder.stop();

        //Now store the video locally
        var blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'test.webm';
        a.click();
        window.URL.revokeObjectURL(url);

    } 
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);

    //console.log(recordedChunks[0]);
  } else {
    // ...
  }
}



function define_start(second) {

    if (second) {
        v2_start_time = document.getElementById('v2_start').value;
        v2_start_time = parseFloat(v2_start_time);

        //if user puts starttime that is lower than 0 or higher than endtime
        if (v2_start_time < 0 || v2_start_time >= v2_end_time) {
            v2_start_time = 0;
            document.getElementById('v2_start').value = 0;
        }
    } else {
        v1_start_time = document.getElementById('v1_start').value;
        v1_start_time = parseFloat(v1_start_time);

        //if user puts starttime that is lower than 0 or higher than endtime
        if (v1_start_time < 0 || v1_start_time >= v1_end_time) {
            v1_start_time = 0;
            document.getElementById('v1_start').value = 0;
        }
    }
}

function define_end(second) {

    if (second) {
        v2_end_time = document.getElementById('v2_end').value;
        v2_end_time = parseFloat(v2_end_time);

        //if user puts endtime that is lower than the start time or higher than the duration
        if (v2_end_time <= v2_start_time || v2_end_time >= video2.duration) {
            v2_end_time = video2.duration;
            document.getElementById('v2_end').value = video2.duration;
        }
    } else {
        v1_end_time = document.getElementById('v1_end').value;
        v1_end_time = parseFloat(v1_end_time);

        //if user puts endtime that is lower than the start time or higher than the duration
        if (v1_end_time <= v1_start_time || v1_end_time >= video1.duration) {
            v1_end_time = video1.duration;
            document.getElementById('v1_end').value = video1.duration;
        }
    }
}


function loop(second) {
    //console.log(parseInt(video1.duration / 60, 10));
    if (second) {
        //to begin the loop again, or if the loop hasn't started yet
        if (video2.currentTime > v2_end_time || video2.currentTime < v2_start_time) {
            video2.currentTime = v2_start_time;
        }
    } else {
        //to begin the loop again, or if the loop hasn't started yet
        if (video1.currentTime > v1_end_time || video1.currentTime < v1_start_time) {
            video1.currentTime = v1_start_time;

        }
        //console.log(video1.duration);

        //console.log(video1.currentTime);
    }
}

function zoom_in() {

}

function zoom_out() {

}

function open_dialog() {

}







/*


// ---------- OLD CODE TO CALL A PYTHON FUNCTION --- NOT IN USE --------

function get_video() {

    //this is the render process not the main process. In terminal when we start npm start, we only see logging from main process, this way here we can see the render logging too
    //var nodeConsole = require('console');
    //var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

    console.log("Js file loaded sucsessfully");
    document.getElementById("video_one_load_button").style.color = "red";

   const {PythonShell} = require("python-shell");
    //import {PythonShell} from 'python-shell';
    //let {PythonShell} = require('python-shell')
    var path = require('path');

    var options= {
        scriptPath : path.join(__dirname, '/../engine/')
    }

	var py = new PythonShell('video.py', options);

	py.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

    // end the input stream and allow the process to exit
    py.end(function (err) {
        if (err){
            throw err;
        };

        console.log('Js finished');
    });



    var py2 = new PythonShell('video.py', options);


    py2.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

    // end the input stream and allow the process to exit
    py2.end(function (err) {
        if (err){
            throw err;
        };

        console.log('Js finished');
    });

}
*/