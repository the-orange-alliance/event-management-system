import Tkinter as Tk
import Queue as queue
from GuiSetupWindows import SetupWindows
from GuiGlobalField import GlobalField

root = Tk.Tk()
root.resizable(width=False, height=False)
q1 = queue.Queue()
q2 = queue.Queue()
list = [0, 1, 2, 3, 4]

# sw = SetupWindows(root, q1, q2)
# sw.pack()
# sw.mainloop()
gui = GlobalField(root, q1, q2)
gui.pack()
# root.mainloop()
while True:
    gui.update_idletasks()
    gui.update()
    root.update_idletasks()
    root.update()


