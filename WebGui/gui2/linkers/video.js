var recorder, video1, video2, v1_start_time, v2_start_time, v1_end_time, v2_end_time, stream_obj;
var recordedChunks = [];
var interval;


var width = screen.width / 2 - 10;
var height = screen.height / 2 + 100;
document.getElementById("video1").width = width;
document.getElementById("video1").height = height;
document.getElementById("video2").width = width;
document.getElementById("video2").height = height;




//if the user puts some numbers into the form, the  button Play & record gets activated
/*$("#form").on("input", function() {
    document.getElementById('record_and_play').removeAttribute('disabled');

    clearInterval(interval); 
});*/

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
    //REALLY IMPORTANT to use .path here and not .name. We want the whole path for the video
    //not just the name so we can open videos from every folder (absolute path)
    var path = file[0].path;
    get_video(path, second);

    //let input form blink
    //interval = setInterval(blink, 500);
}

//make the start and end time input fields blink to indicate that we want the user to input something
/*function blink() {
    var box1 = document.getElementById('v2_start');
    box1.style.borderColor =  (box1.style.borderColor == "white" ? "black" : "white");

    var box2 = document.getElementById('v2_end');
    box2.style.borderColor =  (box2.style.borderColor == "white" ? "black" : "white");

}*/

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
                //video.setAttribute('src', stream);
                stream_obj = stream;
                video.play();

                //we need to attatch the stream_obj that we just got to a 
                //MediaRecorder Object, so that we can use it to record the video later
                var options;
                if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                    options = {mimeType: 'video/webm; codecs=vp9'};
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                    options = {mimeType: 'video/webm; codecs=vp8'};
                }

                recorder = new MediaRecorder(stream, options);

                //here we are calling the handleDataAbailable function if data is available to do something with it
                recorder.ondataavailable = handleDataAvailable;
                //recorder.start();
            })

            .catch(function(error){
                console.log("Something went wrong in use_webcam function.");
                console.log(error);
            });

    }  
    video.pause();
    enable_input_fields(second);
}


//calles by use_webcam if data is available to start doing something with the data
function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}



//This function is called from the auto handler handle_files after selecting the file, to now work with the selected file
function get_video(path, second) {
    //with camera stream, only working if we use video here not with 'var video', but before this point video doesn't exist
    video = video1;
    if (second) {
        video = video2;
    }

    //need to be careful here: in use_webcam() the src Object is set with video.srcObject = stream; not with video.setAttribute(). If we don't reset
    //it to null it seems to override the attributes that are set with setAttribute.
    video.srcObject = null;
    //first I created a seperate source object here, which is complete nonesense
    //it's totally dufficient to add the path from the file picker <video src="path" ...>
    video.setAttribute('src', path);
    video.load();
    video.play();

   

    //video.pause();
   /* var playPromise = video.play();
 
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            video.pause();
        })
        .catch(error => {
            console.log("Not save to pause video.");
        });
  }*/


    //add an update, as soon as the video is running loop is called constantly
    video.ontimeupdate = function() {loop(second)};

    enable_input_fields(second);
}

function enable_input_fields(second) {
    //enable the input fields for start end end input of the loop after video is loaded now
    /*if (second) {
        document.getElementById('v2_start').disabled = false;
        document.getElementById('v2_end').disabled = false;
    } else {
        document.getElementById('v1_start').disabled = false;
        document.getElementById('v1_end').disabled = false;
    }*/
}





function record_videos() {

    video2.play();

    //if recorder.state returns the string recording, the video is already being recorded
    if (recorder.state.localeCompare("recording")) {
        //very important to set a imeSlice argument  in start, that specifies the length of media to capture for each Blob
        recorder.start(3000);
        document.getElementById("record_and_play").childNodes[0].nodeValue="Stop Recording & Video";
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
        a.download = 'recording.webm';
        a.click();
        window.URL.revokeObjectURL(url);

        recordedChunks.length = 0;
        blob = null;

        document.getElementById("record_and_play").childNodes[0].nodeValue="Start Recording & Play Video";

        video2.pause();

        document.getElementById("play_both").removeAttribute('disabled');
    } 
}





function play_both(){
    if (video1.paused || video2.paused) { 
        video1.play();
        video2.play();
        document.getElementById("play_both").childNodes[0].nodeValue="Pause Both";
    }
    else {
        video1.pause();
        video2.pause();
        document.getElementById("play_both").childNodes[0].nodeValue="Play Both";
    }


}


function define_start(second) {

    v2_start_time = 0;
    v2_end_time = 0;
    v1_start_time = 0;
    v1_end_time = 0;

    if (second) {
        v2_start_time = document.getElementById('v2_start').value;
        v2_start_time = parseFloat(v2_start_time);
        video2.play();
        video2.pause();

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