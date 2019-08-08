# Video_Compare 

Originally this project started in Python and OpenCV. The goal was to load two videos next to each other to enable in depth comparison. The video should be able to be started at the same time to analyse difference between the videos. 
Possibilities to slow them down, to mute one, to have one side as a webcam, and record the own actions while having the video you are following on the other side should be included. Then after recording it should be possible to pick aout a part and compare it in depth.

The first approach was to use Python and load the videos with OpenCV. As a Gui Tkinter was used and as a gui builder Page. In the end Tkinter proved to be too old fashioned, the look wasn't quiet what a modern gui interface would have needed. So I switched to Electron later, which provides a possibility to style the interface in HTML and CSS and have JavaScript and Python functions do the work. 

In the end, I completely abandonned Python, since JavaScript and HTML5 provide all the necessary functionality, there is no need to use Python. With the Electron Framework all of this can be displayed in a seperate window. 

Nevertheless, there follows an explanation of the old Python Code that is located in the Python Project folder now. The working version of the Code is inside of the WebGui folder.

##Python Project:


# WebCamRecorder.py
This programm starts a tiny Tkinter Gui in which you can click start to make your Webcam start recording you. You can click stop and an output.avi file of you sitting in front of your computer is generated in the same folder. It's only a small helper programm.


# Video.py
This is the main program, it has a gui to open two video via file selector, to play them after hitting play and to load a video from a webcam inside the gui.




## WebGui:

#