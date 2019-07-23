from Tkinter import *
import Tkinter, Tkconstants, tkFileDialog
import Tkinter as tkinter
import ttk as ttk
import cv2
import PIL.Image, PIL.ImageTk
import time


 #start gui designer with: ~/.local/bin/pygubu-designer
class App:
	def __init__(self):
		_bgcolor = '#d9d9d9'  # X11 color: 'gray85'
		_fgcolor = '#000000'  # X11 color: 'black'
		_compcolor = '#d9d9d9' # X11 color: 'gray85'
		_ana1color = '#d9d9d9' # X11 color: 'gray85'
		_ana2color = '#ececec' # Closest X11 color: 'gray92'

		self.l_play = 0
		self.r_play = 0

	
		self.vid1 = None
		self.vid2 = None
		
		# -----------GUI---------------------------------------------------------------------

		self.style = ttk.Style()
		#self.style.theme_use('calm')
		self.style.configure('.',background=_bgcolor)
		self.style.configure('.',foreground=_fgcolor)
		self.style.configure('.',font="TkDefaultFont")
		self.style.map('.',background=
			[('selected', _compcolor), ('active',_ana2color)])

		self.top = tkinter.Toplevel()

		self.top.geometry("760x511+541+155")
		self.top.title("New Toplevel")
		self.top.configure(background="#d8d8d8")

		self.Canvas1 = tkinter.Canvas(self.top)
		self.Canvas1.place(relx=0.013, rely=0.078, relheight=0.667
				, relwidth=0.488)
		self.Canvas1.configure(borderwidth="2")
		self.Canvas1.configure(relief="ridge")
		self.Canvas1.configure(selectbackground="#c4c4c4")
		self.Canvas1.configure(width=371)

		self.Button4 = tkinter.Button(self.Canvas1)
		self.Button4.place(relx=0.647, rely=0.029, height=33, width=117)
		self.Button4.configure(text='''Load Video''', command=self.callback_openFirstFile)

		self.Canvas2 = tkinter.Canvas(self.top)
		self.Canvas2.place(relx=0.513, rely=0.078, relheight=0.667
				, relwidth=0.475)
		self.Canvas2.configure(borderwidth="2")
		self.Canvas2.configure(relief="ridge")
		self.Canvas2.configure(selectbackground="#c4c4c4")
		self.Canvas2.configure(width=361)

		self.Button5 = tkinter.Button(self.Canvas2)
		self.Button5.place(relx=0.637, rely=0.029, height=33, width=117)
		self.Button5.configure(text='''Load Video''', command=self.callback_openSecondFile)

		self.Button1 = tkinter.Button(self.top)
		self.Button1.place(relx=0.171, rely=0.763, height=33, width=61)
		self.Button1.configure(text='''Play''', command=self.callback_l_play)

		self.Button2 = tkinter.Button(self.top)
		self.Button2.place(relx=0.711, rely=0.763, height=33, width=61)
		self.Button2.configure(text='''Play''', command=self.callback_r_play)
		self.Button2.configure(width=61)

		self.Button3 = tkinter.Button(self.top)
		self.Button3.place(relx=0.013, rely=0.92, height=33, width=741)
		self.Button3.configure(text='''Play both''', command=self.callback_both_play)
		self.Button3.configure(width=741)

		self.TSeparator1 = ttk.Separator(self.top)
		self.TSeparator1.place(relx=0.507, rely=0.039, relheight=0.841)
		self.TSeparator1.configure(orient="vertical")

		#-------------------------------------------------------------------------------------

		# After it is called once, the update method will be automatically called every delay milliseconds
		self.delay = 15
		self.update()

		self.top.mainloop()


	def update(self):


		#self.window.geometry('{}x{}'.format(int(self.vid1.width+self.vid2.width), int(self.maxHeight)))
		# Get a frame from the video source, calling method get_frame from MyVideoCapture class
		if self.vid1 != None:
			if self.l_play:
				ret1, frame1 = self.vid1.get_frame()

				#if the flag ret1 shows that video 1 exists
				if ret1:
					self.photo1 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame1))
					self.Canvas1.create_image(0, 0, image = self.photo1, anchor = tkinter.NW)
		
 				
		if self.vid2 != None:
			if self.r_play:
				ret2, frame2 = self.vid2.get_frame()

				if ret2:
					self.photo2 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame2))
					self.Canvas2.create_image(0, 0, image = self.photo2, anchor = tkinter.NW)

				#if ret1 & ret2:
					#self.photo1 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame1))
					#self.photo2 = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame2))
					#self.canvas1.create_image(0, 0, image = self.photo1, anchor = tkinter.NW)
					#self.canvas2.create_image(0, 0, image = self.photo2, anchor = tkinter.NW)



 		# needed to run update constantly
		self.top.after(self.delay, self.update)







	def callback_openFirstFile(self):
		self.video_source1 = tkFileDialog.askopenfilename(title = "Select file", filetypes = (("all files","*.*"),("avi files","*.avi"), ("mp4 files","*.mp4"),("webm files","*.webm")))		
		self.vid1 = MyVideoCapture(self.video_source1)

	def callback_openSecondFile(self):
		self.video_source2 = tkFileDialog.askopenfilename(title = "Select file", filetypes = (("all files","*.*"),("avi files","*.avi"), ("mp4 files","*.mp4"),("webm files","*.webm")))		
		self.vid2 = MyVideoCapture(self.video_source2)

	def callback_useWebcam(self):
		self.vid2 = MyVideoCapture(0)
 
	def callback_l_play(self):
		if self.l_play == 0:
			self.l_play = 1
			self.Button1.configure(text='''Pause''')
		else:
			self.Button1.configure(text='''Play''')
			self.l_play = 0	


	def callback_r_play(self):
		if self.r_play == 0:
			self.r_play = 1
			self.Button2.configure(text='''Pause''')
		else:
			self.r_play = 0	
			self.Button2.configure(text='''Play''')


	def callback_both_play(self):
		if self.l_play == 0 | self.r_play == 0:
			self.l_play = 1
			self.r_play = 1
			self.Button3.configure(text='''Pause both''')
		else:
			self.l_play = 0		
			self.r_play = 0	
			self.Button3.configure(text='''Play both''')


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
