from REVcomm import *
import Tkinter as Tk

class AddressDebugging:

    def __init__(self):
        self.commObj = REVcomm()
        self.redEnc = None
        self.blueEnc = None
        self.REVmodules = [None, None]
        self.root = Tk.Tk()
        self.redVar = Tk.StringVar()
        self.redVar.set("Red rotor: 0/25")
        self.blueVar = Tk.StringVar()
        self.blueVar.set("Blue rotor: 0/25")

        self.displayEncoders(0)

    def displayEncoders(self, port):
        Tk.Label(self.root, textvariable=self.redVar, font='Helvetica 18 bold').pack()
        Tk.Label(self.root, textvariable=self.blueVar, font='Helvetica 18 bold').pack()
        self.root.update_idletasks()
        self.root.update()
        self.root.config(cursor="wait")
        self.commObj.openActivePort(port)
        if self.setup_field(port) == -1:
            for widget in self.root.winfo_children():
                widget.destroy()
            Tk.Label(self.root, text="Issue connecting to hubs. Ensure USB & RS485 are plugged and hubs are properly addressed.", font='Helvetica 14 bold').pack()
            print("2 USBs connected")
            self.root.mainloop()
        else:
            self.root.configure(cursor="")
            errors = 0
            while True:
                # self.redEnc.setPower(port, 5000)
                # self.blueEnc.setPower(port, 5000)
                try:
                    red = self.redEnc.getPosition(port)
                    blue = self.blueEnc.getPosition(port)

                    print("Red: " + str(red) + " Blue: " + str(blue))
                    self.redVar.set("Red rotor: " + str(red) + "/25")
                    self.blueVar.set("Blue rotor: " + str(blue) + "/25")
                    self.root.update_idletasks()
                    self.root.update()
                except AttributeError:
                    print("Can't read mag sensor")
                    errors += 1
                    time.sleep(.1)
                    if errors > 10:
                        for widget in self.root.winfo_children():
                            widget.destroy()
                        Tk.Label(self.root, text="Magnetic encoder error. May have been caused by abruptly unplugging a sensor.", font='Helvetica 14 bold').pack()
                        self.root.mainloop()
                except Tk.TclError:
                    break
        self.commObj.closeActivePort(port)

    def setup_field(self, port):

        self.commObj.discovered = REVMsg.Discovery()
        print(str(self.commObj.discovered))
        packets = self.commObj.sendAndReceive(port, self.commObj.discovered, 255)
        mod1 = None
        mod2 = None

        try:
            for packet in packets:
                module = Module(self.commObj, packet.header.source, packet.payload.parent)
                module.init_periphs(port)
                address = module.getAddress()
                print("Address: " + str(address) + " Location: " + str(module))
                if address == 2:
                    mod1 = module
                else:
                    mod2 = module
            self.REVModules = [mod1, mod2]
            print("REVModules: " + str(self.REVModules))
            if self.REVModules is not [] and mod1 is not None and mod2 is not None:
                for module in self.REVModules:
                    module.sendKA(port)
                self.redEnc = self.REVModules[0].motors[3]
                self.redEnc.init(port)
                self.redEnc.resetEncoder(port)
                self.blueEnc = self.REVModules[0].motors[0]
                self.blueEnc.resetEncoder(port)
                self.blueEnc.init(port)

                # self.redEnc = self.REVModules[0].dioPins[1]
                # self.redEnc.setAsInput()

            else:
                return -1
            return 0
        except TypeError:
            print("Did not receive DiscoveryRSP Packet")
            return -1


if __name__ == '__main__':
    ad = AddressDebugging()
