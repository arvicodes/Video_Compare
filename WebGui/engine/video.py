import multiprocessing
import numpy as np
import cv2
from PIL import Image


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





def startVideo():
    print ("test")    

def rewind10Seconds():
    total_frames = vid.get(7)   # I'd specify that 7 is the ordinal value of CV_CAP_PROP_FRAME_COUNT and that 1 is the ordinal value of CV_CAP_PROP_POS_FRAMES 

    vid.set(1, 100)
    ret, frame = vid.read()
    cv2.imwrite("path_where_to_save_image", frame)





if __name__ == "__main__":
    
    print("Python file loaded successfully")

    # open Video, error message if not successfull
    # npm is started from gui folder, we go to WebGui -> VideoCompare and there the video is located, 
    vid = cv2.VideoCapture("../../a1QnG8Y_460svvp9.webm")   #"../../engine/a1QnG8Y_460svvp9.webm"   #"a1QnG8Y_460svvp9.webm"
    
    while (vid.isOpened()):
        #read returns one boolean flag if reading was sucessfull and one frame of the video material, meaning one picture
        ret, frame = vid.read()
        if ret:
            #mirroring of the current frame
            frame = cv2.flip(frame, 1)
            #let's convert the current frame to BGR color
            cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)
        
            # Display the resulting frame
            cv2.imshow('frame', cv2image)

            #img = Image.fromarray(cv2image) # not necessary, maybe later
            #imgtk = ImageTk.PhotoImage(image=img)
            #videoLabel.imgtk = imgtk

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

           
    # When everything is done release the capture
    vid.release()
    cv2.destroyAllWindows()
   