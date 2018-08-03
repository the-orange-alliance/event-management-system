import Tkinter as Tk
from GuiRadioLabelRow import RadioLabelRow
from GuiRadioRow import RadioRow
from GuiResourceLabelCol import ResourceLabelCol

# ----------------------- PWM vals -----------------------
BLACK = 1997
WHITE = 1965
GREEN = 1885
SOLID_RED = 1805
SOLID_BLUE = 1935
COLOR_2_SCROLL_ACROSS_COLOR_1 = 1705
DEFAULT_PWM = WHITE
FIELD_CLEAR = GREEN
POWERLINE_ACTIVE_RED = SOLID_RED
POWERLINE_ACTIVE_BLUE = SOLID_BLUE
POWERLINE_SCORING_RED = COLOR_2_SCROLL_ACROSS_COLOR_1
POWERLINE_SCORING_BLUE = COLOR_2_SCROLL_ACROSS_COLOR_1

COOP_RED_HALF = 1655 #1705?
COOP_BLUE_HALF = 1555
COOP_SUCCESS = 1715

pwmOptions_red = [BLACK, WHITE, POWERLINE_ACTIVE_RED, POWERLINE_SCORING_RED, SOLID_RED, GREEN]
pwmOptions_blue = [BLACK, WHITE, POWERLINE_ACTIVE_BLUE, POWERLINE_SCORING_BLUE, SOLID_RED, GREEN]
pwmOptions_coop = [BLACK, WHITE, COOP_RED_HALF, COOP_BLUE_HALF, COOP_SUCCESS, SOLID_RED, GREEN]
# ----------------------- PWM vals -----------------------


class GlobalField(Tk.Frame):

    def __init__(self, parent, push_to):
        self.parent = parent
        self.push_to = push_to

        Tk.Frame.__init__(self, self.parent)

        self.q2 = Tk.Frame(self, background="#ffb3b3")
        self.q2.grid(row=1, column=1, sticky="NSEW")
        self.q3 = Tk.Frame(self, background="#b3b3ff")
        self.q3.grid(row=2, column=1, sticky="NSEW")
        self.q4 = Tk.Frame(self, background="#ecb3ff")
        self.q4.grid(row=3, column=1, sticky="NSEW")
        self.turbineRow = Tk.Frame(self, background="#b3ecff")
        self.turbineRow.grid(row=5, column=1, sticky="NSEW")
        # self.push_to.put("test")
        self.manual_mode = False

        radiolabels = ["Black", "White", "Connected", "Scoring", "Red", "Green"]
        cooprls = ["Black", "White", "Conn-Red", "Conn-Blue", "Scoring", "Red", "Green"]
        resourceLabels = ["Wind", "Reaction", "Combustion"]

        # initialize radio rows, resource labels
        self.rrr = []
        self.rrb = []
        for i in range(0, 3, 1):
            self.rrr.append(RadioRow(self.q2, self.push_to, "PWM", 0, i, BLACK, pwmOptions_red))
            self.rrb.append(RadioRow(self.q3, self.push_to, "PWM", 1, i, BLACK, pwmOptions_blue))
        self.rrc = RadioRow(self.q4, self.push_to, "PWM", 2, 3, BLACK,
                            pwmOptions_coop)  # radio rows, coop

        self.rsl = [ResourceLabelCol(self.q2, resourceLabels),
                    ResourceLabelCol(self.q3, resourceLabels),
                    ResourceLabelCol(self.q4, ["Coopertition"])]  # resource labels
        self.turbrl = RadioLabelRow(self.turbineRow, ["Not Spinning", " Spinning"])
        self.turbrsl = ResourceLabelCol(self.turbineRow, ["Red Turbine", "Blue Turbine"])
        self.turbrr = [RadioRow(self.turbineRow, self.push_to, "Rotor", 0, 3, 0, [0, 1]),
                       RadioRow(self.turbineRow, self.push_to, "Rotor", 1, 3, 0, [0, 1])]

        self.rl = [RadioLabelRow(self.q2, radiolabels),
                   RadioLabelRow(self.q3, radiolabels),
                   RadioLabelRow(self.q4, cooprls)]  # radio labels

        self.put_in_grid()

    def put_in_grid(self):
        # q2 ----------------------------------------------------------------------------------------------------------
        self.rl[0].grid(row=0, column=1)
        self.rsl[0].grid(row=1, rowspan=3, column=0, sticky=Tk.W)
        self.rrr[0].grid(row=1, column=1)
        self.rrr[1].grid(row=2, column=1)
        self.rrr[2].grid(row=3, column=1)
        # q2 ----------------------------------------------------------------------------------------------------------

        # q3 ----------------------------------------------------------------------------------------------------------
        self.rl[1].grid(row=0, column=1)
        self.rsl[1].grid(row=1, rowspan=3, column=0, sticky=Tk.W)
        self.rrb[0].grid(row=1, column=1)
        self.rrb[1].grid(row=2, column=1)
        self.rrb[2].grid(row=3, column=1)
        # q3 ----------------------------------------------------------------------------------------------------------

        # q4 ----------------------------------------------------------------------------------------------------------
        self.rl[2].grid(row=0, column=1)
        self.rsl[2].grid(row=1, column=0, sticky=Tk.W)
        self.rrc.grid(row=1, column=1)
        # q4 ----------------------------------------------------------------------------------------------------------

        # turbines ----------------------------------------------------------------------------------------------------
        self.turbrl.grid(row=0, column=1)
        self.turbrsl.grid(row=1, rowspan=2, column=0, sticky=Tk.W)
        self.turbrr[0].grid(row=1, column=1)
        self.turbrr[1].grid(row=2, column=1)
        # turbines ----------------------------------------------------------------------------------------------------

    def set_colors(self, red, blue, purple, babyBlue):
        self.q2.configure(bg=red)
        self.q3.configure(bg=blue)
        self.q4.configure(bg=purple)
        self.turbineRow.configure(bg=babyBlue)
        # refresh color in children, which references colors we just configured above
        for i in range(0, 3, 1):
            self.rl[i].updateColor()
            self.rrr[i].updateColor()
            self.rrb[i].updateColor()
            self.rsl[i].updateColor()
        self.rrc.updateColor()
        self.turbrr[0].updateColor()
        self.turbrr[1].updateColor()
        self.turbrl.updateColor()
        self.turbrsl.updateColor()

    def disable_buttons(self):
        for i in range(0, 3, 1):
            self.rrr[i].disableButtons()
            self.rrb[i].disableButtons()
        self.rrc.disableButtons()
        self.turbrr[0].disableButtons()
        self.turbrr[1].disableButtons()

    def enable_buttons(self):
        for i in range(0, 3, 1):
            self.rrr[i].enableButtons()
            self.rrb[i].enableButtons()
        self.rrc.enableButtons()
        self.turbrr[0].enableButtons()
        self.turbrr[1].enableButtons()

    def set_manual(self, _bool):
        self.manual_mode = _bool
        if self.manual_mode:
            self.enable_buttons()
            self.set_colors("#ff0000", "#0000ff", "#ac00e6", "#33ccff")
        else:
            self.disable_buttons()
            self.set_colors("#ffb3b3", "#b3b3ff", "#ecb3ff", "#b3ecff")

    def set_radio(self, alliance_index, _type, value, num):
        """alliance index: 0 - red, 1 - blue, 2 - coop
        type: rotor or pwm,
        value: to set the var to
        num: use if a pwm. 0 - wind, 1 - reaction, 2 - combustion"""
        if _type == "pwm":
            if alliance_index == 0:
                self.rrr[num].setRadio(value)
            elif alliance_index == 1:
                self.rrb[num].setRadio(value)
            else:
                self.rrc.setRadio(value)
        else:
            self.turbrr[alliance_index].setRadio(value)
