import Tkinter as Tk

COL_SPACING = 110  # in px


class RadioRow(Tk.Frame):

    def __init__(self, parent, *args):
        """"Create a radio button row with the following arguments:
        (parent, push_to, type, alliance_index, scoring_index, init_val, val_list)
        """
        self.parent = parent
        self.push_to = args[0]
        self._type = args[1]
        self.alliance_index = args[2]
        self.scoring_index = args[3]
        self.current_selection = Tk.IntVar()
        self.current_selection.set(args[4])
        self.valid_selections = args[5]
        self.length = len(self.valid_selections)
        Tk.Frame.__init__(self, parent)
        self.buttons = []

        for i in range(0, self.length, 1):
            # print("Creating radio button.")
            if self._type == "PWM":
                button = Tk.Radiobutton(self, variable=self.current_selection, command=self.pushUpdatePWM,
                                        background=self.parent["background"], value=self.valid_selections[i])
            else:
                button = Tk.Radiobutton(self, variable=self.current_selection, command=self.pushUpdateRotor,
                                        background=self.parent["background"], value=self.valid_selections[i])
            self.buttons.append(button)
            button.grid(row=1, column=i, sticky="NSEW")  #, padx=(4, 0)) slight adjustment because it's not perfectly centered
            self.grid_columnconfigure(i, minsize=COL_SPACING)  # consistent spacing

    def setRadio(self, val):
        if val in self.valid_selections:
            self.current_selection.set(val)
        else:
            raise ValueError("GUI attempted to set radio var to impossible value.")

    def disableButtons(self):
        for button in self.buttons:
            button.configure(state=Tk.DISABLED)

    def enableButtons(self):
        for button in self.buttons:
            button.configure(state=Tk.NORMAL)

    def updateColor(self):
        for button in self.buttons:
            button.config(background=self.parent["background"])

    def pushUpdatePWM(self):
        print("pushing PWM change to stack")
        self.push_to.put({"PWM": [self.alliance_index, self.scoring_index, self.current_selection.get()]})

    def pushUpdateRotor(self):
        print("pushing Rotor change to stack")
        self.push_to.put({"Rotor": [self.alliance_index, self.current_selection.get()]})

