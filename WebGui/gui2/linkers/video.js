var recorder, video1, video2, v2_start_time, v2_end_time, stream_obj;
var recordedChunks = [];
var interval, blob, url;


var width = screen.width / 2 - 10;
var height = screen.height / 2 + 100;
document.getElementById("video1").width = width;
document.getElementById("video1").height = height;
document.getElementById("video2").width = width;
document.getElementById("video2").height = height;

init();


function init() {

    video1 = document.getElementById('video1');
    video2 = document.getElementById('video2');

    v1_start_time = 0;
    v2_start_time = 0;
    v1_end_time = 10000;
    v2_end_time = 10000;

    use_webcam();
}

// ####### WEBCAM ########################################################
function use_webcam() {
    video = video1;

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
                var options = {mimeType: 'video/webm; codecs=vp9'};
                recorder = new MediaRecorder(stream, options);

                //here we are calling the handleDataAbailable function if data is available to do something with it
                recorder.ondataavailable = handle_data_available;
                //recorder.start();
            })

            .catch(function(error){
                console.log("Something went wrong in use_webcam function.");
                console.log(error);
            });

    }  
    video.pause();
}


//AUTO CALL FKT by use_webcam(): called by use_webcam if data is available to start doing something with the data
function handle_data_available(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}


// ####### OPEN VIDEO FILE ########################################################

// Calles from the Open Video Button
function open_file() {
    //get the hidden <input type="file"> file loader element and force a click on it
    var loader = document.getElementById('file_loader_2');
    loader.click();

    //Now, as soon as the user selects the file, handle_files is calles automatically and we can work with the selected file
}

//AUTO CALL FKT by open_file(): function is called when the user finished selecting the file in the open file dialogue
function handle_files(file) {
    //REALLY IMPORTANT to use .path here and not .name. We want the whole path for the video
    //not just the name so we can open videos from every folder (absolute path)
    var path = file[0].path;
    get_video(path);
}


//This function is called from the auto handler handle_files after selecting the file, to now work with the selected file
function get_video(path) {
    //with camera stream, only working if we use video here not with 'var video', but before this point video doesn't exist
    video = video2;
    
    //need to be careful here: in use_webcam() the src Object is set with video.srcObject = stream; not with video.setAttribute(). If we don't reset
    //it to null it seems to override the attributes that are set with setAttribute.
    video.srcObject = null;
    //first I created a seperate source object here, which is complete nonesense
    //it's totally dufficient to add the path from the file picker <video src="path" ...>
    video.setAttribute('src', path);
    video.load();
    video.play();

    //add an update, as soon as the video is running loop is called constantly
    video.ontimeupdate = function() {loop()};

}

// ####### RECORDING ########################################################

function record_videos() {

    video2.play();

    //if recorder.state returns the string recording, the video is already being recorded
    if (recorder.state.localeCompare("recording")) {
        //very important to set a imeSlice argument  in start, that specifies the length of media to capture for each Blob
        recorder.start(3000);
        //document.getElementById("record_and_play").childNodes[0].nodeValue="Stop Recording & Video";
        document.getElementById("record_and_play").disabled = true;
    }
  
    own_asyncCall();   
}
async function own_asyncCall() {
    //await enables us to wait for the promise that the current time is bigger than the end time
    while(true) {
        if (video2.currentTime > v2_end_time-1) {
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    //waited until end of loop is reached, now store the file and load it again
    recorder.stop();
    video2.pause();
    reopen();
}

function store_file_on_drive() {        

    //Now store the video locally
    blob = new Blob(recordedChunks, {
       type: 'video/webm'
    });
    console.log(blob.size);
    url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.webm';
    a.click();
}

function reopen() {

    //Again, we need a blob first to bundel the recorded data nicely to reopen it
    blob = null;
    blob = new Blob(recordedChunks, {
       type: 'video/webm'
    });
    console.log(blob.size);
    url = URL.createObjectURL(blob);
    video = video1;

    video.srcObject = null;
    video.setAttribute('src', url);
    video.load();
    
    video.play();
    video2.play();
}

function new_recording(){
    window.URL.revokeObjectURL(url);
    recordedChunks.length = 0;
    blob = null;

    video1.srcObject = null;
    use_webcam();
    document.getElementById("record_and_play").disabled = false;
    video2.currentTime = v2_start_time;
    video2.pause();
}


// ####### BUTTONS & LOOP ########################################################


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


function define_start() {
    v2_start_time = 0;
    v2_end_time = 5000;
 
    v2_start_time = document.getElementById('v2_start').value;
    v2_start_time = parseFloat(v2_start_time);

    video2.play();
    video2.pause();

    //if user puts starttime that is lower than 0 or higher than endtime
    if (v2_start_time < 0 || v2_start_time >= v2_end_time) {
        v2_start_time = 0;
        document.getElementById('v2_start').value = 0;
    }
    
}

function define_end() {

    v2_end_time = document.getElementById('v2_end').value;
    v2_end_time = parseFloat(v2_end_time);

    //if user puts endtime that is lower than the start time or higher than the duration
    if (v2_end_time <= v2_start_time || v2_end_time >= video2.duration) {
        v2_end_time = video2.duration;
        document.getElementById('v2_end').value = video2.duration;
    }
    
}


function loop() {
    //console.log(parseInt(video1.duration / 60, 10));
    
    //to begin the loop again, or if the loop hasn't started yet
    if (video2.currentTime > v2_end_time || video2.currentTime < v2_start_time) {
        video2.currentTime = v2_start_time;
    }
}




