import Tkinter as Tk
import tkMessageBox


class SetupWindows(Tk.Frame):

    def __init__(self, parent, push_to, pop_from):
        self.push_to = push_to
        self.popFrom = pop_from
        self.parent = parent
        self.label = None
        self.b1 = None
        self.exit = False  # for retry window

        Tk.Frame.__init__(self, self.parent)

        self.top = Tk.Frame(self)
        self.top.grid(row=1, column=1)
        self.bot = Tk.Frame(self)
        self.bot.grid(row=2, column=1)

    def mainloop(self, n=0):
        self.render_1()
        print("Setup window 1 rendered.")
        while True:
            if self.exit:
                self.push_to.put("exitAllThreads")
                break
            try:
                self.update_idletasks()
                self.update()
                self.parent.update_idletasks()
                self.parent.update()

                if not self.popFrom.empty():
                    got = self.popFrom.get()
                    if got == "retry1":
                        self.render_retry()
                    elif got == "retry2":
                        self.render_retry()
                    elif got == "step1done":
                        self.configure(cursor="")
                        self.b1.config(state=Tk.NORMAL)
                    elif got == "step2done":
                        self.configure(cursor="")
                        self.b1.config(state=Tk.NORMAL)
                        self.push_to.put("endSetup")
                        break
            except Tk.TclError:
                print("Setup exited.")
                break

    def ask_quit(self):
        if tkMessageBox.askokcancel("Quit", "Are you sure?"):
            self.stopProgram()

    def stopProgram(self):
        self.exit = True

    def render_1(self):
        self.label = Tk.Label(self.top, text="Plug in field 1/3 then press OK", font='Helvetica 14')
        self.label.pack()
        self.b1 = Tk.Button(self.bot, text="  Ok  ", command=self.render_2)
        self.b1.pack()

    def render_2(self):
        self.configure(cursor="wait")
        self.push_to.put("step1")

        self.label.destroy()
        self.b1.destroy()

        self.label = Tk.Label(self.top, text="Plug in field 2/4 then press OK", font='Helvetica 14')
        self.label.pack()
        self.b1 = Tk.Button(self.bot, text="  Ok  ", command=self.render_3)
        self.b1.pack()
        self.b1.configure(state=Tk.DISABLED)

    def render_3(self):
        self.b1.configure(state=Tk.DISABLED)
        self.configure(cursor="wait")
        self.push_to.put("step2")

    def render_retry(self):
        self.label.destroy()
        self.b1.destroy()
        self.configure(cursor="")
        self.label = Tk.Label(self.top, text="An initialization error occurred. Unplug USBs, power cycle, and re-launch the app.", font='Helvetica 14')
        self.label.pack()
        self.b1 = Tk.Button(self.bot, text="  Ok  ", command=self.stopProgram)
        self.b1.pack()
