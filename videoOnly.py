import multiprocessing
import Tkinter as tk
import cv2
import Image, ImageTk


e = multiprocessing.Event()
p = None
vid = None
Canvas = None
# -------begin capturing and saving video
def startrecording(e):
    cap = cv2.VideoCapture(0)
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    out = cv2.VideoWriter('output.avi',fourcc,  20.0, (640,480))

    while(cap.isOpened()):
        if e.is_set():
            cap.release()
            out.release()
            cv2.destroyAllWindows()
            e.clear()
        ret, frame = cap.read()
        if ret==True:
            out.write(frame)
        else:
            break

def start_recording_proc():
    global p
    p = multiprocessing.Process(target=startrecording, args=(e,))
    p.start()

# -------end video capture and stop tk
def stoprecording():
    e.set()
    p.join()

    root.quit()
    root.destroy()



def update():

     #read returns one boolean flag if reading was sucessfull and one frame of the video material, meaning one picture
    _, frame = vid.read()
    frame = cv2.flip(frame, 1)
    #let's convert the current frame to BGR color
    cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)
    img = Image.fromarray(cv2image)
    imgtk = ImageTk.PhotoImage(image=img)
    #add video to Label
    videoLabel.imgtk = imgtk
    videoLabel.configure(image=imgtk)

    root.after(15, update)

def startVideo():
    print ("test")    

def rewind10Seconds():
    total_frames = vid.get(7)   # I'd specify that 7 is the ordinal value of CV_CAP_PROP_FRAME_COUNT and that 1 is the ordinal value of CV_CAP_PROP_POS_FRAMES 

    vid.set(1, 100)
    ret, frame = vid.read()
    cv2.imwrite("path_where_to_save_image", frame)





if __name__ == "__main__":
    # -------configure window
    root = tk.Tk()
    root.geometry("%dx%d+0+0" % (500, 700))

    # create Label to display video
    videoLabel = tk.Label(root)
    videoLabel.pack()

    # open Video, error message if not successfull
    vid = cv2.VideoCapture("a1QnG8Y_460svvp9.webm")
    if not vid.isOpened():
        raise ValueError("Unable to open video source", "a1QnG8Y_460svvp9.webm")
    

   
    startButton=tk.Button(root,width=10,height=1,text='START',command=start_recording_proc)
    stopButton=tk.Button(root,width=10,height=1,text='STOP', command=stoprecording)
    startVideoButton=tk.Button(root,width=10,height=1,text='START VIDEO', command=startVideo)
    rewind10Seconds =tk.Button(root,width=10,height=1,text='REWIND 10 Seconds', command=rewind10Seconds)
    startButton.pack()
    stopButton.pack()
    startVideoButton.pack()
    rewind10Seconds.pack()

    #calling update once initially, from there on root.after method takes over of calling the update methode for every frame
    update()
    # -------begin
    root.mainloop()