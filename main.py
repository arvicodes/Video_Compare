from Tkinter import *
import ttk
from time import sleep
import numpy as np
import cv2


# Open Tkinter Window
root = Tk()
root.geometry('1200x600')
root.configure(background='white')

# adding a more modern style with ttk
style= ttk.Style()
style.theme_names()
style.theme_use('alt')



# define the two pannels, first one is menu, second one contains the two video windows
m1 = PanedWindow(root, orient=VERTICAL)
m1.pack(fill=BOTH, expand=1)
m1.configure(background='black')

m2 = PanedWindow(root)
m2.pack(fill=BOTH, expand=1)




# ------- FUNCTIONS -----------



# Callback function for checkbox if user wants vertical or horizontal alignment
def callBackVertical():
	print(vertical.get())

	if vertical.get():
		m2.configure(orient=VERTICAL)
	else:
		print('now')
		m2.configure(orient=HORIZONTAL)





# --------- MENU ----------------
menu = Label(m1, text="Menu", height=1)
m1.add(menu)


#Checkbutton to see if user wants vertical or horizontal alignment
vertical = BooleanVar()
vertical.set(True)

checkVertical = Checkbutton(root, text="vertical", var=vertical, command=callBackVertical)
checkVertical.configure(background='white')
m1.add(checkVertical)










# --------- LEFT PANEL --------------

left = Label(m2, text="REFERENCE")
m2.add(left)


vid = cv2.VideoCapture('a1QnG8Y_460svvp9.webm')
if not vid.isOpened():
	raise ValueError("nable to open video source.")

canvas = Canvas( 500, 500)
canvas.pack()


# ---------- RIGHT PANEL -------------

right = Label(m2, text="OWN", height=10)
m2.add(right)






root.mainloop()