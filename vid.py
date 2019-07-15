from Tkinter import *
import Tkinter, Tkconstants, tkFileDialog
import Tkinter as tkinter
import ttk as ttk
import cv2
import PIL.Image, PIL.ImageTk
import time
 
class App:
	def __init__(self, window, window_title, video_source1=0, video_source2=0):
		self.window = window
		self.window.title(window_title)
		self.video_source1 = video_source1
		self.video_source2 = video_source2


		self.m1 = PanedWindow(window, orient=HORIZONTAL)
		self.m1.pack(fill=BOTH, expand=0)

 
		# open video sources (by default this will try to open the computer webcam)
		self.filename = tkFileDialog.askopenfilename(initialdir = "/",title = "Select file",filetypes = (("jpeg files","*.jpg"),("all files","*.*")))		
		self.vid1 = MyVideoCapture(self.video_source1)
		self.vid2 = MyVideoCapture(self.video_source2)

 
		# Create a canvas that can fit the above video source size
		self.canvas1 = tkinter.Canvas(window, width = self.vid1.width, height = self.vid1.height)
		self.canvas1.pack(side="left", fill="both", expand= True)
		self.canvas1.configure(bg="white")
		self.m1.add(self.canvas1)

		self.openFile1 = Button(text="Open first video", command=callback_openFirstFile)
		self.m1.add(self.openFile1)


		self.canvas2 = tkinter.Canvas(window, width = self.vid2.width, height = self.vid2.height)
		self.canvas2.pack(side="left", fill="both", expand= False)
		self.canvas2.configure(bg="white")
		self.m1.add(self.canvas2)

 
 		# Calculate maximal hight
 		self.maxHeight = self.vid1.height if (self.vid1.height > self.vid2.height) else self.vid2.height
		# Button that lets the user take a snapshot
		self.btn_snapshot=tkinter.Button(window, text="Snapshot", width=50, command=self.snapshot)
		self.btn_snapshot.pack(fill="both", expand=True)
		#self.btn_snapshot.place(x= 0, y=self.maxHeight, width= 200, height=30)
		self.btn_snapshot.place(x = 0, y = 0, relwidth = 0.1, relheight = 0.1)

		# After it is called once, the update method will be automatically called every delay milliseconds
		self.delay = 15
		self.update()
 
		self.window.mainloop()
 
	def snapshot(self):
		# Get a frame from the video source
		ret, frame = self.vid1.get_frame()
 
		if ret:
			cv2.imwrite("frame-" + time.strftime("%d-%m-%Y-%H-%M-%S") + ".jpg", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
 
	def update(self):

		self.window.geometry('{}x{}'.format(int(self.vid1.width+self.vid2.width), int(self.maxHeight)))
		# Get a frame from the video source
		ret1, frame1 = self.vid1.get_frame()
		ret2, frame2 = self.vid2.get_frame()
 
		if ret1:
			self.photo1 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame1))
			self.canvas1.create_image(0, 0, image = self.photo1, anchor = tkinter.NW)
		if ret2:
			self.photo2 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame2))
			self.canvas2.create_image(0, 0, image = self.photo2, anchor = tkinter.NW)

		if ret1 & ret2:
			self.photo1 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame1))
			self.photo2 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame2))
			self.canvas1.create_image(0, 0, image = self.photo1, anchor = tkinter.NW)
			self.canvas2.create_image(0, 0, image = self.photo2, anchor = tkinter.NW)

 
		self.window.after(self.delay, self.update)
 
 
class MyVideoCapture:
	def __init__(self, video_source=0):
		# Open the video source
		self.vid = cv2.VideoCapture(video_source)
		if not self.vid.isOpened():
			raise ValueError("Unable to open video source", video_source)
 
		# Get video source width and height
		self.width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
		self.height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
 
	def get_frame(self):
		if self.vid.isOpened():
			ret, frame = self.vid.read()
			if ret:
				# Return a boolean success flag and the current frame converted to BGR
				return (ret, cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
			else:
				return (ret, None)
		else:
			return (ret, None)
 
	# Release the video source when the object is destroyed
	def __del__(self):
		if self.vid.isOpened():
			self.vid.release()
 
# Create a window and pass it to the Application object
App(tkinter.Tk(), "Video Analyser/Comparer", 0, 'a1QnG8Y_460svvp9.webm')
