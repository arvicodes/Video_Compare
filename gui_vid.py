from tkinter import *
from tkinter import ttk
from tkinter.ttk import *
from tkinter import filedialog
import tkinter as tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time


 #start gui designer with: ~/.local/bin/pygubu-designer
class App:
	def __init__(self):
		
		self.l_play = 0
		self.r_play = 0
		self.firstTime1 = True
		self.firstTime2 = True
	
		self.vid1 = None
		self.vid2 = None
		
		# -----------GUI---------------------------------------------------------------------

		self.top = tkinter.Tk()

		self.screen_width = self.top.winfo_screenwidth()
		self.screen_height = self.top.winfo_screenheight()

		self.top.geometry('%ix%i' % (self.screen_width,self.screen_height)) #760x511+541+155
		self.top.title("Video Compare")
		self.top.configure(background="#ffffff")

		self.Canvas1 = tkinter.Canvas(self.top)
		self.Canvas1.place(relx=0.001, rely=0.01, relheight=0.75
				, relwidth=0.5)
		self.Canvas1.configure(borderwidth="2")
		self.Canvas1.configure(relief="ridge")
		self.Canvas1.configure(selectbackground="#c4c4c4")
		self.Canvas1.configure(width=371)

		self.Button4 = ttk.Button(self.Canvas1)
		self.Button4.place(relx=0.647, rely=0.029, height=33, width=117)
		self.Button4.configure(text='''Load Video''', command=lambda: self.callback_openDialog(1))

		self.Canvas2 = tkinter.Canvas(self.top)
		self.Canvas2.place(relx=0.496, rely=0.01, relheight=0.75
				, relwidth=0.503)
		self.Canvas2.configure(borderwidth="2")
		self.Canvas2.configure(relief="ridge")
		self.Canvas2.configure(selectbackground="#c4c4c4")
		self.Canvas2.configure(width=371)

		self.Button5 = ttk.Button(self.Canvas2)
		self.Button5.place(relx=0.65, rely=0.029, height=33, width=117)
		self.Button5.configure(text='''Load Video''', command=lambda: self.callback_openDialog(2))

		self.Button1 = ttk.Button(self.top)
		self.Button1.place(relx=0.171, rely=0.763, height=33, width=61)
		self.Button1.configure(text='''Play''', command=self.callback_l_play)

		self.Button2 = ttk.Button(self.top)
		self.Button2.place(relx=0.711, rely=0.763, height=33, width=61)
		self.Button2.configure(text='''Play''', command=self.callback_r_play)
		self.Button2.configure(width=61)

		self.Button3 = ttk.Button(self.top)
		self.Button3.place(relx=0.013, rely=0.92, height=33, width=self.screen_width - 50)
		self.Button3.configure(text='''Play both''', command=self.callback_both_play)

		#-------------------------------------------------------------------------------------

		# After it is called once, the update method will be automatically called every delay milliseconds
		self.delay = 15
		self.update()

		self.top.mainloop()


	def update(self):



		#self.window.geometry('{}x{}'.format(int(self.vid1.width+self.vid2.width), int(self.maxHeight)))
		# Get a frame from the video source, calling method get_frame from MyVideoCapture class

		if self.vid1 != None:
			if self.l_play | self.firstTime1:

				self.firstTime1 = False
				ret1, frame1 = self.vid1.get_frame()

				#if the flag ret1 shows that video 1 exists
				if ret1:
					self.photo1 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame1))
					self.Canvas1.create_image(0, 0, image = self.photo1, anchor = tkinter.NW)
					
		if self.vid2 != None:
			if self.r_play | self.firstTime2:

				self.firstTime2 = False
				ret2, frame2 = self.vid2.get_frame()

				if ret2:
					self.photo2 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame2))
					self.Canvas2.create_image(0, 0, image = self.photo2, anchor = tkinter.NW)

		# needed to run update constantly
		self.top.after(self.delay, self.update)






	# Opening Video 1 or Video 2 from a File after selecting 'Open From File' in the Dialog field
	def callback_openVideoFromFile(self, videoNumber):
		# left video
		if videoNumber == 1:
			self.video_source1 = filedialog.askopenfilename(title = "Select file", filetypes = (("all files","*.*"),("avi files","*.avi"), ("mp4 files","*.mp4"),("webm files","*.webm")))		
			self.vid1 = MyVideoCapture(self.video_source1)
			self.firstTime1 = True

		# right video
		elif videoNumber == 2:
			self.video_source2 = filedialog.askopenfilename(title = "Select file", filetypes = (("all files","*.*"),("avi files","*.avi"), ("mp4 files","*.mp4"),("webm files","*.webm")))		
			self.vid2 = MyVideoCapture(self.video_source2)
			self.firstTime2 = True

		self.dialog.destroy()
		

	def callback_useWebcam(self, videoNumber):
		if videoNumber == 1:
			self.vid1 = MyVideoCapture(0)
			self.firstTime1 = True

		elif videoNumber == 2:
			self.vid2 = MyVideoCapture(0)
			self.firstTime2 = True

		self.dialog.destroy()

	
	# Function ist called by the 'Load Video' Button and offers a GUI to choose the Source of the Video to load, for example a File, from the Webcam or from an external camera source
	def callback_openDialog(self, videoNumber):
		self.dialog = tkinter.Tk()

		self.dialog.geometry("227x202+667+252")
		self.dialog.title("Select Video Source Dialog")

		self.Dia_Label = tkinter.Label(self.dialog)
		self.Dia_Label.place(relx=0.164, rely=0.099, height=48, width=150)
		self.Dia_Label.configure(text='''Select video source:''')
		self.Dia_Label.configure(width=126)

		self.Dia_Button1 = tkinter.Button(self.dialog)
		self.Dia_Button1.place(relx=0.264, rely=0.347, height=28, width=116)
		self.Dia_Button1.configure(text='''Open from File''', command=lambda: self.callback_openVideoFromFile(videoNumber))

		self.Dia_Button2 = tkinter.Button(self.dialog)
		self.Dia_Button2.place(relx=0.176, rely=0.545, height=28, width=149)
		self.Dia_Button2.configure(text='''Open from Webcam''', command=lambda: self.callback_useWebcam(videoNumber))

		self.Dia_Button3 = tkinter.Button(self.dialog)
		self.Dia_Button3.place(relx=0.088, rely=0.743, height=28, width=191)
		self.Dia_Button3.configure(text='''Open from external Source''')


		self.dialog.mainloop()


	# Called by the left Play Button
	def callback_l_play(self):
		if self.l_play == 0:
			self.l_play = 1
			self.Button1.configure(text='''Pause''')
		else:
			self.Button1.configure(text='''Play''')
			self.l_play = 0	


	# Called by the right Play Button
	def callback_r_play(self):
		if self.r_play == 0:
			self.r_play = 1
			self.Button2.configure(text='''Pause''')
		else:
			self.r_play = 0	
			self.Button2.configure(text='''Play''')


	# Called by the Play Both Button
	def callback_both_play(self):
		if self.l_play == 0 | self.r_play == 0:
			self.l_play = 1
			self.r_play = 1
			self.Button3.configure(text='''Pause both''')
			self.Button1.configure(text='''Pause''')
			self.Button2.configure(text='''Pause''')
		else:
			self.l_play = 0		
			self.r_play = 0	
			self.Button3.configure(text='''Play both''')
			self.Button1.configure(text='''Play''')
			self.Button2.configure(text='''Play''')




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
App()
