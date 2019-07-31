
//function get_video() {

    console.log("Js file loaded sucsessfully");

    //document.getElementById("video_one_load_button").style.color = "red";

    const {PythonShell} = require("python-shell");
    //import {PythonShell} from 'python-shell';
    //let {PythonShell} = require('python-shell')
    var path = require('path');

	var video = new PythonShell('../../engine/video.py');

	video.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

    // end the input stream and allow the process to exit
    video.end(function (err) {
        if (err){
            throw err;
        };

        console.log('finished');
    });

//}
