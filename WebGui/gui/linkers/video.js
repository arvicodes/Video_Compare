var video1, video2, seekBar, v1_start_time, v2_start_time, v1_end_time, v2_end_time;

function init() {

    video1 = document.getElementById('video1');
    video2 = document.getElementById('video2');

}

function get_video_js_only(second) {

    init();

    var source = document.createElement('source');

    source.setAttribute('src', 'a1QnG8Y_460svvp9.webm');

    video = video1;
    if (second) {
        video = video2;
    }

    video.appendChild(source);
    video.play();

    setTimeout(function() {  
        video.pause();

        source.setAttribute('src', 'a1QnG8Y_460svvp9.webm#t=15,20'); 

        video.load();
        video.play();
    }, 10000);
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
}


function define_start() {

    var v2_start_input = document.getElementById('v2_start');
    v2_start_time = v2_start_input;
    console.log(v2_start_time);

    video2.currentTime = parseFloat(v2_start_time);

}

function define_end() {
    var v2_end_input = document.getElementById('v2_end');
    v2_end_time = v2_end_input;
    console.log(v2_end_time);
}


function loop() {
    if (video2.currentTime >= v2_end_time) {
        video2.currentTime = v2_start_time;
    }
}

function zoom_in() {

}

function zoom_out() {

}

function open_dialog() {

}










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
