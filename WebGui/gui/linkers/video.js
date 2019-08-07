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
    //video.play();

    //add an update, as soon as the video is running loop is called constantly
    video.ontimeupdate = function() {loop(second)};
    console.log(second);
    setTimeout(function() {  
        video.pause();

        source.setAttribute('src', 'a1QnG8Y_460svvp9.webm#t=15,20'); 

        video.load();
        video.play();
    }, 10000);



    //enable the input fields for start end end input of the loop after video is loaded now
    if (second) {
        document.getElementById('v2_start').disabled = false;
        document.getElementById('v2_end').disabled = false;
        v2_end_time = video.duration;
    } else {
        document.getElementById('v1_start').disabled = false;
        document.getElementById('v1_end').disabled = false;
        v1_end_time = video.duration;
    }


    video.controls.innerHTML =  '<button class="play">play</button>'+
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
                          '</div>';
    


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


function define_start(second) {
    if (second) {
        var v2_start_input = document.getElementById('v2_start').value;
        v2_start_time = v2_start_input;

        //if user puts starttime that is lower than 0 or higher than endtime
        if (v2_start_time < 0 || v2_start_time >= v2_end_time) {
            v2_start_time = 0;
            document.getElementById('v2_start').value = 0;
        }
    } else {

        var v1_start_input = document.getElementById('v1_start').value;
        v1_start_time = v1_start_input;

        //if user puts starttime that is lower than 0 or higher than endtime
        if (v1_start_time < 0 || v1_start_time >= v1_end_time) {
            v1_start_time = 0;
            document.getElementById('v1_start').value = 0;
        }
    }
}

function define_end(second) {
    if (second) {
        var v2_end_input = document.getElementById('v2_end').value;
        v2_end_time = v2_end_input;

        //if user puts endtime that is lower than the start time or higher than the duration
        if (v2_end_time <= v2_start_time || v2_end_time >= video2.duration) {
            v2_end_time = video2.duration;
            document.getElementById('v2_end').value = video2.duration;
        }
    } else {

        var v1_end_input = document.getElementById('v1_end').value;
        v1_end_time = v1_end_input;

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

        if (video2.currentTime > v2_end_time) {
            video2.currentTime = v2_start_time;
        }
    } else {

        if (video1.currentTime > v1_end_time) {
            video1.currentTime = v1_start_time;
        }
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
