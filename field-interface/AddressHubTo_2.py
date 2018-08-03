from REVcomm import *
import Tkinter as Tk

class AddressDebugging:

    def __init__(self):
        self.commObj = REVcomm()
        self.redRotor = [None, None]
        self.blueRotor = [None, None]

        self.redWind = [None, None]
        self.redReactor = [None, None]
        self.redCombustion = [None, None]
        self.blueWind = [None, None]
        self.blueReactor = [None, None]
        self.blueCombustion = [None, None]
        self.coop = [None, None]

        self.setAddress(0, 2)

    def setAddress(self, port, a):
        root = Tk.Tk()
        Tk.Label(root, text="   Re-addressing connected hub to '2'   ", font='Helvetica 18 bold').pack()
        root.update_idletasks()
        root.update()
        if len(self.commObj.listPorts()) > 1:
            for widget in root.winfo_children():
                widget.destroy()
            Tk.Label(root, text="2 USBs connected. Please be explicit about which hub needs re-addressing by only plugging one in.", font='Helvetica 14 bold').pack()
            print("2 USBs connected")
            root.mainloop()
        else:
            self.commObj.openActivePort(port)
            self.commObj.discovered = REVMsg.Discovery()
            print(str(self.commObj.discovered))
            packets = self.commObj.sendAndReceive(port, self.commObj.discovered, 255)
            try:
                for packet in packets:
                    module = Module(self.commObj, packet.header.source, packet.payload.parent)
                    module.setAddress(port, a)
                    print("Module address: " + str(module.getAddress()))
            except TypeError:
                for widget in root.winfo_children():
                    widget.destroy()
                Tk.Label(root, text="Error. Please: 1) Unplug RS485 cable and USB  2) Power cycle  3) Re-plug USB and 4) Re-lanuch re-addressing app.", font='Helvetica 14 bold').pack()
                print("bleh")
                root.mainloop()
        self.commObj.closeActivePort(port)


if __name__ == '__main__':
    ad = AddressDebugging()
