import Tkinter as Tk
import thread
from GuiGlobalField import GlobalField
from GuiSetupWindows import SetupWindows


class Gui(Tk.Frame):

    def __init__(self, parent, push_to, pop_from):
        self.parent = parent
        self.push_to = push_to
        self.pop_from = pop_from
        Tk.Frame.__init__(self, self.parent)

        self.activeField = 0  # default
        self.manual_mode = False
        self.stop = False

        self.field_connected = None
        self.socket_connected = None
        self.manual_str = None
        self.notesVar = None

        # init everything for primary gui
        self.q1 = None
        self.globalfields = [None, None]  # 2 instances, 1 per field - switched on&off
        self.notes = None
        self.fieldtoggle1 = None
        self.fieldtoggle2 = None

        # init everything for SetupWindows
        self.setup = None
        print("GUI basic init")

    def main(self):
        # init everything for SetupWindows
        self.setup = SetupWindows(self, self.push_to, self.pop_from)
        self.setup.pack()
        print("Setup packed into gui")
        self.setup.mainloop()  # run setup
        if not self.stop:
            self.setup.destroy()  # destroy when done

            # self.push_to.queue.clear()
            # self.pop_from.queue.clear()
            self.renderScreen()  # primary gui here
            self.mainloop(n=0)

    def mainloop(self, n=0):
        """Overriding update function of Tkinter"""
        while True: # TODO - add notes to gui if field change doesnt work (only 1 usb active), display for active field
            if not self.pop_from.empty():
                popped = self.pop_from.get()
                # print(str(popped))
                if popped == "1 field connected":
                    self.field_connected.set("connected (1 field - Control malfunctions if field > 1!)")
                elif popped == "2 fields connected":
                    self.field_connected.set("connected (2 fields)")
                elif popped == "field disconnected":
                    self.field_connected.set("disconnected")
                elif popped == "socket connected":
                    self.socket_connected.set("connected")
                elif popped == "socket disconnected":
                    self.socket_connected.set("disconnected")
                elif popped == "module discovery error":
                    self.notesVar.set("A USB cable is not plugged into its proper expansion hub.")
                elif popped == "USB not plugged in":
                    self.notesVar.set("A USB cable is not plugged in.")
                elif popped == "Notes empty":
                    self.notesVar.set("Viewing field " + str(self.activeField + 1) + "/" + str(self.activeField + 3) + ".")
                elif popped == "mag not operating":
                    self.notesVar.set("A turbine encoder is not working. REFRESH to return functionality")
                elif popped == "Both USBs same field":
                    self.notesVar.set("Both USBs are plugged into the same field")
                elif popped == "refresh done":
                    self.configure(cursor="")
                    self.notesVar.set("Recently refreshed.")
                elif popped == "match over":
                    print("Match over.")
                elif popped == "resetRotors":
                    self.globalfields[self.activeField].set_radio(0, "rotor", 0, -1)
                    self.globalfields[self.activeField].set_radio(1, "rotor", 0, -1)
                elif isinstance(popped, dict) and isinstance(popped.get("fieldChange"), int):
                    if not self.manual_mode:
                        self.field_update(popped["fieldChange"])  # swap fields if needed
                elif isinstance(popped, dict) and isinstance(popped.get("Rotor"), list):
                    if not self.manual_mode:
                        self.globalfields[self.activeField].set_radio(popped["Rotor"][0], "rotor", popped["Rotor"][1], -1)  # last argument meaningless unless pwm
                elif isinstance(popped, dict) and isinstance(popped.get("FieldPWMs"), list):
                    self.globalfields[self.activeField].set_radio(2, "pwm", popped["FieldPWMs"][6], -1)
                    for i in range(0, 3, 1):
                        self.globalfields[self.activeField].set_radio(0, "pwm", popped["FieldPWMs"][i], i)
                        self.globalfields[self.activeField].set_radio(1, "pwm", popped["FieldPWMs"][i+3], i)
                elif isinstance(popped, dict) and isinstance(popped.get("PWM"), list):
                    if popped["PWM"][0] == 2 or popped["PWM"][1] == 3:
                        self.globalfields[self.activeField].set_radio(2, "pwm", popped["PWM"][2], popped["PWM"][1])
                    else:
                        if popped["PWM"][0] == 0:
                            self.globalfields[self.activeField].set_radio(0, "pwm", popped["PWM"][2], popped["PWM"][1])
                        else:
                            self.globalfields[self.activeField].set_radio(1, "pwm", popped["PWM"][2], popped["PWM"][1])
                else:
                    pass

            if self.stop:
                break
            else:
                try:
                    self.globalfields[self.activeField].update_idletasks()
                    self.globalfields[self.activeField].update()
                    self.update_idletasks()  # update gui based on user or socket actions
                    self.update()
                    self.parent.update_idletasks()  # update top level frame holding the gui
                    self.parent.update()
                except Tk.TclError:
                    pass
        # self.destroy()
        thread.exit()
        print("Can still print after thread exit - GUI")

    def renderScreen(self):
        self.parent.resizable(width=False, height=False)
        # Setup -------------------------------------------------------------------------------------------------------
        self.field_connected = Tk.StringVar()
        self.field_connected.set("field disconnected")
        self.socket_connected = Tk.StringVar()
        self.socket_connected.set("socket disconnected")
        self.manual_str = Tk.StringVar()
        self.manual_str.set("Enable Manual Mode")
        self.notesVar = Tk.StringVar()
        self.notesVar.set("Viewing field " + str(self.activeField + 1) + "/" + str(self.activeField + 3) + ".")

        self.q1 = Tk.Frame(self)
        self.q1.grid(row=1, column=1)
        self.globalfields[0] = GlobalField(self, self.push_to)  # field 0
        self.globalfields[1] = GlobalField(self, self.push_to)  # field 1 (not active right now)
        self.globalfields[0].grid(row=2, column=1, sticky="NSEW")
        self.notes = Tk.Frame(self)
        self.notes.grid(row=3, column=1, sticky="NSEW")

        # Setup -------------------------------------------------------------------------------------------------------

        # Anchoring ---------------------------------------------------------------------------------------------------
        Tk.Button(self, text="REFRESH", command=self.refresh).place(relx=0.13, anchor=Tk.NE)
        # q1 ----------------------------------------------------------------------------------------------------------
        Tk.Label(self.q1, text="FIRST Global Field Control", font='Helvetica 18 bold').grid(row=0, column=1, columnspan=2)
        Tk.Label(self.q1, text="EMS:").grid(row=2, column=1, sticky=Tk.E)
        Tk.Label(self.q1, textvariable=self.socket_connected).grid(row=2, column=2, sticky=Tk.W)
        Tk.Label(self.q1, text="Field:").grid(row=3, column=1, sticky=Tk.E)
        Tk.Label(self.q1, textvariable=self.field_connected).grid(row=3, column=2, sticky=Tk.W)
        Tk.Button(self.q1, textvariable=self.manual_str, command=self.toggle_manual).grid(row=4, column=1, columnspan=2)
        # q1 ----------------------------------------------------------------------------------------------------------

        Tk.Label(self.notes, text="Notes:", font='Helvetica 12 bold').pack(side=Tk.LEFT)
        Tk.Label(self.notes, textvariable=self.notesVar, font='Helvetica 10').pack(side=Tk.LEFT)
        # Anchoring ---------------------------------------------------------------------------------------------------

        self.globalfields[0].disable_buttons()
        self.globalfields[1].disable_buttons()

    def toggleField1(self):
        self.field_update(0)  # swap fields if needed
        self.push_to.put({"fieldChange": 0})  # allowing main app to check if its active field is the gui's active field
        if self.field_connected != "disconnected":
            self.notesVar.set("CONTROLLING FIELD 1/3")
        else:
            self.notesVar.set("VIEWING (not controlling) FIELD 1/3")

    def toggleField2(self):
        self.field_update(1)  # swap fields if needed
        self.push_to.put({"fieldChange": 1})  # allowing main app to check if its active field is the gui's active field
        if self.field_connected != "disconnected":
            self.notesVar.set("CONTROLLING FIELD 2/4")
        else:
            self.notesVar.set("VIEWING (not controlling) FIELD 2/4")

    def toggle_manual(self):
        """Toggle manual. If manual, both fields in manual mode - else, both auto"""
        if self.manual_mode:
            self.manual_mode = False
            self.push_to.put("auto")
            self.manual_str.set("Enable Manual Mode")
            self.notesVar.set("Viewing field " + str(self.activeField + 1) + "/" + str(self.activeField + 3) + ".")
            self.fieldtoggle1.destroy()
            self.fieldtoggle2.destroy()
        else:
            self.manual_mode = True
            self.push_to.put("manual")
            self.manual_str.set("Enable Auto Mode")
            if self.field_connected != "disconnected":
                self.notesVar.set("CONTROLLING FIELD " + str(self.activeField+1) + "/" + str(self.activeField+3))
            else:
                self.notesVar.set("VIEWING (not controlling) FIELD " + str(self.activeField + 1) + "/" + str(self.activeField + 3))
            self.fieldtoggle1 = Tk.Button(self.q1, text="Field 1/3", command=self.toggleField1)
            self.fieldtoggle1.grid(row=4, column=0, sticky=Tk.E)
            self.fieldtoggle2 = Tk.Button(self.q1, text="Field 2/4", command=self.toggleField2)
            self.fieldtoggle2.grid(row=4, column=3, sticky=Tk.W)
        self.globalfields[0].set_manual(self.manual_mode)
        self.globalfields[1].set_manual(self.manual_mode)

    def setStop(self, _bool):
        self.stop = _bool

    def refresh(self):
        self.push_to.put("refresh")
        self.config(cursor="wait")

    def field_update(self, newField):
        if newField != self.activeField:
            # put old field out of frame
            self.globalfields[self.activeField].grid_forget()
            self.activeField = newField
            # bring new field into view
            self.globalfields[self.activeField].grid(row=2, column=1, sticky="NSEW")
            if self.notesVar.get()[:7] == "Viewing":
                self.notesVar.set("Viewing field " + str(self.activeField + 1) + "/" + str(self.activeField + 3) + ".")