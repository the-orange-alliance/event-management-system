import Tkinter as Tk

COL_SPACING = 110  # in px

class ResourceLabelCol(Tk.Frame):

    def __init__(self, parent, word_list):
        """Creating a Label Row with the following arguments:
        (parent, wordList)"""
        self.parent = parent
        self.words = word_list
        self.length = len(self.words)
        self.labels = []
        Tk.Frame.__init__(self, self.parent, bg=self.parent["background"])

        for i in range(0, self.length, 1):
            label = Tk.Label(self, text=self.words[i],  font='Helvetica 10 bold', background=self.parent["background"])
            self.labels.append(label)
            label.grid(row=i, column=1, sticky="NSEW")
        self.grid_columnconfigure(1, minsize=COL_SPACING)  # consistent spacing

    def updateColor(self):
        for label in self.labels:
            label.config(background=self.parent["background"])

