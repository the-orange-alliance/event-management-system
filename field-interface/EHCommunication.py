"""Important note - user must make sure that field 1 is on a higher virtual serial port than field 2 because the
solution to the problem is incomplete."""

import REVcomm
from REVcomm import *
from socketIO_client_nexus import SocketIO
from threading import Timer, Thread
import socket
from Gui import Gui
import thread
import queue
import Tkinter as Tk

# from REVgui import MAINgui, DCgui
hostname = socket.gethostname()
HOST = socket.gethostbyname(hostname) # Get my computer's IP
PORT = 8081

# ----------------------- PWM shite -----------------------
BLACK = 1997
WHITE = 1965
GREEN = 1885
SOLID_RED = 1805
SOLID_BLUE = 1935
COLOR_2_SCROLL_ACROSS_COLOR_1 = 1705
DEFAULT_PWM = BLACK
FIELD_CLEAR = GREEN
POWERLINE_ACTIVE_RED = SOLID_RED
POWERLINE_ACTIVE_BLUE = SOLID_BLUE
POWERLINE_SCORING_RED = COLOR_2_SCROLL_ACROSS_COLOR_1
POWERLINE_SCORING_BLUE = COLOR_2_SCROLL_ACROSS_COLOR_1

COOP_RED_HALF = 1655 #1705?
COOP_BLUE_HALF = 1555
COOP_SUCCESS = 1715

# pwmOptions_red = [BLACK, WHITE, POWERLINE_ACTIVE_RED, POWERLINE_SCORING_RED, SOLID_RED, GREEN]
# pwmOptions_blue = [BLACK, WHITE, POWERLINE_ACTIVE_BLUE, POWERLINE_SCORING_BLUE, SOLID_RED, GREEN]
# pwmOptions_coop = [BLACK, WHITE, COOP_BLUE_HALF, COOP_SUCCESS, SOLID_RED, GREEN]
# ----------------------- PWM shite -----------------------

# ----------------------- motor pwr (100,000 max) -----------------------
RED_ROTOR_SPEED = 4750
BLUE_ROTOR_SPEED = 4750
# ----------------------- motor pwr (100,000 max) -----------------------

# ----------------------- wiring map -----------------------

# hub1 LEDs
R_WIND = 3
R_REACTOR = 2
R_COMBUSTION = 1
COOP = 0

# hub2 LEDs`
B_WIND = 0
B_REACTOR = 1
B_COMBUSTION = 2

# hub2 Motors
R_WIND_ROTOR = 1
B_WIND_ROTOR = 0

# ----------------------- wiring map -----------------------


class FieldComms():

    def __init__(self):
        self.fieldNum = 0 #change to none for operation
        # arrays of length == 2 for fields 1 and 2
        self.redWind = [None, None]
        self.blueWind = [None, None]
        self.redCombustion = [None, None]
        self.blueCombustion = [None, None]
        self.redReactor = [None, None]
        self.blueReactor = [None, None]
        self.coop = [None, None]
        self.redRotor = [None, None]
        self.blueRotor = [None, None]

        self.redWind_PWM = [DEFAULT_PWM, DEFAULT_PWM]
        self.blueWind_PWM = [DEFAULT_PWM, DEFAULT_PWM]
        self.redCombustion_PWM = [DEFAULT_PWM, DEFAULT_PWM]
        self.blueCombustion_PWM = [DEFAULT_PWM, DEFAULT_PWM]
        self.redReactor_PWM = [DEFAULT_PWM, DEFAULT_PWM]
        self.blueReactor_PWM = [DEFAULT_PWM, DEFAULT_PWM]
        self.coop_PWM = [DEFAULT_PWM, DEFAULT_PWM]

        self.redRotorEnable = [False, False]
        self.redRotorSpun = [False, False]
        self.blueRotorEnable = [False, False]
        self.blueRotorSpun = [False, False]
        self.reactorFilled = False
        self.combustionScoringTime = [0, 0]

        self.redPowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.bluePowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]

        self.manualMode = False
        self.matchActive = False
        self.guiActiveField = 0
        self.stopAllThreads = False
        self.socketio = None

        self.magnetic_error_counter = 0

        self.REVModules = []
        self.commObj = REVcomm()
        # TODO - use the below vars properly to leave the app in a more complete state
        self.prevComPort = 1000  # used to determine which com port is higher - higher == lower field. start at a high number to engage default case in setup
        self.flippedComOrder = False  # reference for whenever a refresh is needed
        # ------------------------------------------------------------
        self.root = Tk.Tk()
        self.root.protocol("WM_DELETE_WINDOW", self.ask_quit)
        self.setupDone = False
        self.gui = Gui(self.root, guiStack, toGuiStack)
        self.gui.pack()
        self.gui_thread = Thread(target=self.gui.main)
        self.gui_thread.start()
        self.setupListener()
        print("SETUP FINISHED")
        # ------------------------------------------------------------
        self.socket_thread = Thread(target=self._socket_thread)
        self.socket_thread.daemon = True
        self.states_thread = Thread(target=self.setStates)
        self.refresh_listener = Thread(target=self.listenOnGuiStack)

        if self.setupDone:
            if self.REVModules == -1:
                self.controlMode = -1
            elif len(self.REVModules) == 0:
                toGuiStack.put("No USBs plugged in")
                self.controlMode = -1
            else:
                self.controlMode = self.init_modules()
                toGuiStack.put("Notes empty")

    def ask_quit(self):
        guiStack.put("exitAllThreads")
        self.gui.setStop(True)
        time.sleep(2.0)  # ample time for everything else to stop itself
        self.root.destroy()
        print("Current Thread ID exiting - GUI: " + str(thread.get_ident()))

    def setupListener(self):

        def setupInTime(*args):
            """Prevent infinite loops in startup with this fxn.
            Communicates with setup windows if it finishes in time or not.
            args = [boolean, int, boolean] - [port open?, which step?, flipped order?]"""
            print("Setting up:")
            if args[1] == 0:
                if args[2] == True:  # on step 2 even though com port in listPorts is still index 0
                    print("     Step2")
                    if args[0]:
                        toGuiStack.put("step2done")
                    else:
                        toGuiStack.put("retry2")
                else:
                    print("     Step1")
                    if args[0]:
                        toGuiStack.put("step1done")
                    else:
                        toGuiStack.put("retry1")
            else:
                print("     Step2")
                if args[0]:
                    toGuiStack.put("step2done")
                else:
                    toGuiStack.put("retry2")

        def openedInTime(*args):
            """Prevent infinite loops in startup with this fxn.
            Starts setupInTime if it finishes.
            args = [boolean, int, boolean] - [port open?, which port?, flipped order?]"""
            if args[0]:
                finished = [False, args[1], args[2]]
                Timer(6.0, setupInTime, finished).start()
                if self.setup_field(args[1]) == 0:
                    finished[0] = True
            else:
                if args[1] == 0:
                    toGuiStack.put("retry1")
                else:
                    toGuiStack.put("retry2")

        while True:
            if not guiStack.empty():
                got = guiStack.get()
                if got == "endSetup":
                    self.setupDone = True
                    break
                elif got == "step1":
                    finished = [False, 0, False]
                    Timer(6.0, openedInTime, finished).start()
                    if self.commObj.openActivePort(0) == 0:
                        finished[0] = True
                        ports = self.commObj.listPorts()
                        if len(ports) == 1:
                            self.prevComPort = int(ports[0].getName()[3:])  # if only one plugged, get number of com port
                        # else, just go through assuming user knows what she/he is doing
                elif got == "step2":
                    finished = [False, 1, False]
                    ports = self.commObj.listPorts()
                    for port in ports:
                        if int(port.getName()[3:]) > self.prevComPort:  # if second field is of a higher com port, need to open 0th com port since it goes from high to low
                            finished[1] = 0
                            self.flippedComOrder = True
                            finished[2] = True
                            Timer(6.0, openedInTime, finished).start()
                            if self.commObj.openActivePort(0) == 0:
                                finished[0] = True
                            break
                    if not finished[0]:  # otherwise, just use default behavior that 2nd field is of a lower com number
                        Timer(6.0, openedInTime, finished).start()
                        if self.commObj.openActivePort(1) == 0:
                            finished[0] = True

                elif got == "exitAllThreads":
                    self.gui.setStop(True)
                    self.stopAllThreads = True
                    time.sleep(1.0)
                    print("Current Thread ID exiting - setupListener: " + str(thread.get_ident()))
                    break

    def listenOnGuiStack(self):
        while True:
            if not guiStack.empty():
                got = guiStack.get()
                if got == "refresh":
                    self.refresh()
                elif got == "test":
                    print("radio queue works.")
                elif got == "manual":
                    print("got manual")
                    self.manualMode = True
                elif got == "auto":
                    print("got auto")
                    self.manualMode = False
                elif isinstance(got, dict) and isinstance(got.get("fieldChange"), int):
                    if self.guiActiveField != got["fieldChange"]:
                        self.guiActiveField = got["fieldChange"]
                        print("Gui active field changed to " + str(self.guiActiveField) + ". Setting gui to new field's state.")
                        toGuiStack.put({"FieldPWMs": [self.redWind_PWM[self.guiActiveField],
                                                      self.redReactor_PWM[self.guiActiveField],
                                                      self.redCombustion_PWM[self.guiActiveField],
                                                      self.blueWind_PWM[self.guiActiveField],
                                                      self.blueReactor_PWM[self.guiActiveField],
                                                      self.blueCombustion_PWM[self.guiActiveField],
                                                      self.coop_PWM[self.guiActiveField]]})
                elif isinstance(got, dict) and isinstance(got.get("Rotor"), list):
                    print("Popped rotor off of stack. Alliance = " + str(got["Rotor"][0]) + ". Value = " + str(got["Rotor"][1]))
                    if self.manualMode:
                        if got["Rotor"][0] == 0:
                            if got["Rotor"][1] == 1:
                                print("popped --> enable red.")
                                self.redRotorEnable[self.guiActiveField] = True
                            else:
                                self.redRotorEnable[self.guiActiveField] = False
                        else:
                            if got["Rotor"][1] == 1:
                                print("popped --> enable blue.")
                                self.blueRotorEnable[self.guiActiveField] = True
                            else:
                                self.blueRotorEnable[self.guiActiveField] = False
                elif isinstance(got, dict) and isinstance(got.get("PWM"), list):
                    if self.manualMode:
                        print("Setting PWM manually on field " + str(self.guiActiveField))
                        alliance_index = got["PWM"][0]
                        index = got["PWM"][1]
                        value = got["PWM"][2]
                        if alliance_index == 0:
                            if index == 0:
                                self.redWind_PWM[self.guiActiveField] = value
                            elif index == 1:
                                self.redReactor_PWM[self.guiActiveField] = value
                            else:
                                self.redCombustion_PWM[self.guiActiveField] = value
                        elif alliance_index == 1:
                            if index == 0:
                                self.blueWind_PWM[self.guiActiveField] = value
                            elif index == 1:
                                self.blueReactor_PWM[self.guiActiveField] = value
                            else:
                                self.blueCombustion_PWM[self.guiActiveField] = value
                        else:
                            self.coop_PWM[self.guiActiveField] = value

                        print("Got pwm: alliance = " + str(alliance_index) + " index = " + str(index) + " value = " + str(value))
                elif got == "exitAllThreads":
                    self.gui.setStop(True)
                    self.stopAllThreads = True
                    time.sleep(1.0)
                    print("Current Thread ID exiting - refresh: " + str(thread.get_ident()))
                    break
        thread.exit()
        print("Can still print after thread exit - refresh")

    def setStates(self):
        """Loop that sets PWM and motor values on 4 hubs"""
        delay = 1.0
        t = Timer(delay, self.setStates)
        if self.stopAllThreads:
            print("Current Thread ID exiting - states: " + str(thread.get_ident()))
            thread.exit()
            print("Can still print after thread exit - states")
        else:
            t.start()
        if self.setupDone:
            for i in range(0, 2, 1):
                self.redWind[i].setPulseWidth(i, self.redWind_PWM[i])
                self.blueWind[i].setPulseWidth(i, self.blueWind_PWM[i])
                self.redCombustion[i].setPulseWidth(i, self.redCombustion_PWM[i])
                self.blueCombustion[i].setPulseWidth(i, self.blueCombustion_PWM[i])
                self.redReactor[i].setPulseWidth(i, self.redReactor_PWM[i])
                self.blueReactor[i].setPulseWidth(i, self.blueReactor_PWM[i])
                self.coop[i].setPulseWidth(i, self.coop_PWM[i])

                if self.redRotorEnable[i] and not self.redRotorSpun[i]:
                    print("Red rotor spinning")
                    self.enableRotor(i, 0)
                    self.redRotorSpun[i] = True
                    if not self.manualMode:
                        toGuiStack.put({"Rotor": [0, 1]})
                elif self.redRotorSpun[i] and not self.redRotorEnable[i]:
                    if not self.manualMode:
                        toGuiStack.put({"Rotor": [0, 0]})
                        self.redRotor[i].disable(i)
                    else:
                        self.redRotor[i].disable(i)
                    self.redRotorSpun[i] = False

                if self.blueRotorEnable[i] and not self.blueRotorSpun[i]:
                    print("Blue rotor spinning")
                    self.enableRotor(i, 1)
                    self.blueRotorSpun[i] = True
                    if not self.manualMode:
                        toGuiStack.put({"Rotor": [1, 1]})
                elif self.blueRotorSpun[i] and not self.blueRotorEnable[i]:
                    if not self.manualMode:
                        toGuiStack.put({"Rotor": [1, 0]})
                        self.blueRotor[i].disable(i)
                    else:
                        self.blueRotor[i].disable(i)
                    self.blueRotorSpun[i] = False

                if self.combustionScoringTime[0] > 0 and self.redPowerlinesActive[i][2]:
                    self.setLEDPWM("red", "combustion", "active")
                    self.combustionScoringTime[0] -= delay
                elif self.redPowerlinesActive[i][2]:
                    self.setLEDPWM("red", "combustion", "active")
                if self.combustionScoringTime[1] > 0 and self.bluePowerlinesActive[i][2]:
                    self.setLEDPWM("blue", "combustion", "active")
                    self.combustionScoringTime[1] -= delay
                elif self.bluePowerlinesActive[i][2]:
                    self.setLEDPWM("blue", "combustion", "active")

                if not self.manualMode and self.matchActive and self.fieldNum == i:
                    try:
                        red = self.redRotor[i].getPosition(self.fieldNum)
                        blue = self.blueRotor[i].getPosition(self.fieldNum)
                        print("Red: " + str(red) + " Blue: " + str(blue))
                        if not self.redRotorEnable[i] and red >= 25:
                            print("Enabling red rotor by mag.")
                            self.socketio.emit('enableRedRotor')
                        if not self.blueRotorEnable[i] and blue >= 25:
                            print("Enabling blue rotor by mag.")
                            self.socketio.emit('enableBlueRotor')
                    except AttributeError:
                        print("Can't read mag sensor")
                        self.magnetic_error_counter += 1
                        if self.magnetic_error_counter >= 20:
                            toGuiStack.put("mag not operating")
                            self.magnetic_error_counter = 0

    def _socket_thread(self):
        print("SocketIO client operating on " + HOST + ":" + str(PORT))
        self.socketio = SocketIO(HOST, PORT)
        self.socketio.on('connectPythonApp', self.on_connect)
        self.socketio.on('disconnect', self.on_disconnect)
        self.socketio.on('reconnect', self.on_reconnect)
        self.socketio.on('onMatchPrestart', self.on_onPrestart)
        self.socketio.on('setLED', self.on_setLED)
        self.socketio.on('onWindCrank', self.on_onWindCrank)
        self.socketio.on('onMatchAbort', self.on_onMatchAbort)
        self.socketio.on('onMatchEnd', self.on_onMatchEnd)
        self.socketio.on('reactorFull', self.on_reactorFull)
        self.socketio.on('combustionScored', self.on_combustionScored)
        self.socketio.on('onMatchCommit', self.on_onMatchCommit)
        self.socketio.on('onMatchStart', self.on_onMatchStart)
        self.socketio.wait()

    def main(self):
        self.socket_thread.start()
        self.refresh_listener.start()
        self.states_thread.start()

        print("Setup: " + str(self.setupDone))
        print("Threads active: " + str(threading.enumerate()))
        self.refresh_listener.join()
        self.commObj.closeActivePort(0)
        self.commObj.closeActivePort(1)
        guiStack.queue.clear()
        toGuiStack.queue.clear()
        print("End of main")

    # ----------------------- SOCKET STUFF -----------------------

    def on_connect(self):
        print('[Connected]')
        toGuiStack.put("socket connected")

    def on_reconnect(self):
        print('[Reconnected]')

    def on_disconnect(self):
        print('[Disconnected]')
        toGuiStack.put("socket disconnected")

    def on_onPrestart(self, fieldNum):
        if fieldNum['fieldNum'] < 0 or fieldNum['fieldNum'] > 4:
            raise ValueError("Field num from socket is out of range")
        if not self.manualMode:
            if fieldNum['fieldNum'] < 3:
                fn = fieldNum['fieldNum'] - 1
            else:
                fn = fieldNum['fieldNum'] - 3

            print('Field number: ' + str(fn))
            toGuiStack.put({"fieldChange": fn})
            self.guiActiveField = fn
            self.fieldNum = fn
            self.setPrestart(fn)

    def on_onMatchStart(self, obj):
        self.setStart(self.fieldNum)
        self.matchActive = True

    def on_onMatchAbort(self):
        print("Match Aborted.")
        self.fieldAbort(self.fieldNum)
        self.matchActive = False
        toGuiStack.put("match over")

    def on_onMatchEnd(self):
        print("Match Ended.")
        self.fieldReview(self.fieldNum)
        self.matchActive = False
        toGuiStack.put("match over")

    def on_onMatchCommit(self, obj):
        print("Match Ended.")
        self.fieldClear(self.fieldNum)

    def on_setLED(self, obj):
        print('setting LED based off socket call for alliance ' + str(obj['alliance']) + " type: " + str(obj['type']))
        self.setLEDPWM(obj['alliance'], obj['type'], obj['mode'])

    def on_onWindCrank(self, obj):
        if obj['value']:
            print("to gui stack... alliance " + str(obj['alliance_index']))
            toGuiStack.put({"Rotor": [obj['alliance_index'], 1]})
            if obj['alliance_index'] == 0:
                self.redRotorEnable[self.fieldNum] = True
            elif obj['alliance_index'] == 1:
                self.blueRotorEnable[self.fieldNum] = True
            else:
                raise ValueError("alliance value given to rotor is invalid.")

    def on_reactorFull(self):  #TODO - BUG HERE
        print("REACTOR FULL")
        self.reactorFilled = True
        if self.redPowerlinesActive[self.fieldNum][1]:
            self.setLEDPWM("red", "reactor", "active")
        if self.bluePowerlinesActive[self.fieldNum][1]:
            self.setLEDPWM("blue", "reactor", "active")

    def on_combustionScored(self, alliance_index):
        self.combustionScoringTime[alliance_index['alliance_index']] += 2

    # ----------------------- SOCKET STUFF -----------------------

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
            # if len(self.REVModules) > 0 and port == 0:  # This is not what we want
            #     print("Fields out of order. Fixing...")
            #     self.REVModules = [mod1, mod2] + self.REVModules
            # else:
            self.REVModules += [mod1, mod2]
            print("REVModules: " + str(self.REVModules))
            if self.REVModules is not [] and mod1 is not None and mod2 is not None:
                for module in self.REVModules:
                    module.sendKA(port)
            else:
                return -1
            return 0
        except TypeError:
            print("Did not receive DiscoveryRSP Packet")
            return -1

    def init_modules(self):
        if len(self.REVModules) == 4:
            self.modules = [self.REVModules[0], self.REVModules[1], self.REVModules[2],
                            self.REVModules[3]]  # 2-field config
            # field 0
            self.init_hub_1(0, 0)
            self.init_hub_2(0, 1)
            print("Field 0 init.")
            # field 1
            self.init_hub_1(1, 2)
            self.init_hub_2(1, 3)
            toGuiStack.put("2 fields connected")
        elif len(self.REVModules) == 2:
            self.modules = [self.REVModules[0], self.REVModules[1]]  # 1-field config
            self.init_hub_1(0, 0)
            self.init_hub_2(0, 1)
            toGuiStack.put("1 field connected")
        else:
            toGuiStack.put("field disconnected")
            return -1
        return len(self.REVModules) // 2

    def init_hub_2(self, field, moduleNum): #field 0 or 1? --- AKA USB port 0 or 1?
        if field != 0 and field != 1:
            raise ValueError("Field argument passed into init_hub_1 is not 0 or 1.")

        #LEDs
        print("init hub 2: field " + str(field) + ", module " + str(moduleNum))
        self.redWind[field] = self.modules[moduleNum].servos[R_WIND]
        self.redWind[field].init(field)
        self.redWind[field].setPulseWidth(field, DEFAULT_PWM)
        self.redWind[field].enable(field)

        self.redReactor[field] = self.modules[moduleNum].servos[R_REACTOR]
        self.redReactor[field].init(field)
        self.redReactor[field].setPulseWidth(field, DEFAULT_PWM)
        self.redReactor[field].enable(field)

        self.redCombustion[field] = self.modules[moduleNum].servos[R_COMBUSTION]
        self.redCombustion[field].init(field)
        self.redCombustion[field].setPulseWidth(field, DEFAULT_PWM)
        self.redCombustion[field].enable(field)

        self.coop[field] = self.modules[moduleNum].servos[COOP]
        self.coop[field].init(field)
        self.coop[field].setPulseWidth(field, DEFAULT_PWM)
        self.coop[field].enable(field)

    def init_hub_1(self, field, moduleNum):  # field 0 or 1?
        if field != 0 and field != 1:
            raise ValueError("Field argument passed into init_hub_2 is not 0 or 1.")
        # MOTORS
        print("init hub 1: field " + str(field) + ", module " + str(moduleNum))
        self.redRotor[field] = self.modules[moduleNum].motors[R_WIND_ROTOR]
        self.redRotor[field].resetEncoder(field)
        self.blueRotor[field] = self.modules[moduleNum].motors[B_WIND_ROTOR]
        self.blueRotor[field].resetEncoder(field)

        #LEDs
        self.blueCombustion[field] = self.modules[moduleNum].servos[B_COMBUSTION]
        self.blueCombustion[field].init(field)
        self.blueCombustion[field].setPulseWidth(field, 1655)
        self.blueCombustion[field].enable(field)

        self.blueReactor[field] = self.modules[moduleNum].servos[B_REACTOR]
        self.blueReactor[field].init(field)
        self.blueReactor[field].setPulseWidth(field, 1655)
        self.blueReactor[field].enable(field)

        self.blueWind[field] = self.modules[moduleNum].servos[B_WIND]
        self.blueWind[field].init(field)
        self.blueWind[field].setPulseWidth(field, 1655)
        self.blueWind[field].enable(field)

    def enableRotor(self, field, alliance_index):
        print("Enabling rotor.")
        if alliance_index == 0:
            self.redRotor[field].init(field)
            self.redRotor[field].setPower(field, RED_ROTOR_SPEED)
            print("Should red wind be scoring? " + str(self.redPowerlinesActive[field][0]))
            if self.redPowerlinesActive[field][0]:
                self.setLEDPWM("red", "wind", "active")
        else:
            self.blueRotor[field].init(field)
            self.blueRotor[field].setPower(field, BLUE_ROTOR_SPEED)
            print("Should blue wind be scoring? " + str(self.bluePowerlinesActive[field][0]))
            if self.bluePowerlinesActive[field][0]:
                self.setLEDPWM("blue", "wind", "active")

    def setLEDPWM(self, alliance, type, mode):
        if self.fieldNum != 0 and self.fieldNum != 1:
            raise ValueError("Field argument passed into setLEDPWM is not 0 or 1.")
        if self.manualMode:
            field = self.guiActiveField
        else:
            field = self.fieldNum
        data = DEFAULT_PWM
        if alliance == "red":
            if mode == "active":
                data = POWERLINE_ACTIVE_RED

            if type == "wind":
                print("Setting red wind on field " + str(field))
                self.redPowerlinesActive[field][0] = True
                if self.redRotorEnable[field]:
                    data = POWERLINE_SCORING_RED
                self.redWind_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [0, 0, data]})
            elif type == "reactor":
                self.redPowerlinesActive[field][1] = True
                if self.reactorFilled:
                    data = POWERLINE_SCORING_RED
                self.redReactor_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [0, 1, data]})
            elif type == "combustion":
                self.redPowerlinesActive[field][2] = True
                if self.combustionScoringTime[0] > 0:
                    data = POWERLINE_SCORING_RED
                self.redCombustion_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [0, 2, data]})
            elif type == "coop":  #TODO - fix coop conditions so there's a global coop state with 4 options: [none, red, blue, both]
                self.redPowerlinesActive[field][3] = True
                if self.bluePowerlinesActive[field][3]:
                    data = COOP_SUCCESS
                else:
                    data = COOP_RED_HALF
                self.coop_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [2, 3, data]})
            else:
                raise ValueError("powerline type passed into setLEDPWM DNE")
        elif alliance == "blue":
            if mode == "active":
                data = POWERLINE_ACTIVE_BLUE
            if type == "wind":
                self.bluePowerlinesActive[field][0] = True
                if self.blueRotorEnable[field]:
                    data = POWERLINE_SCORING_BLUE
                self.blueWind_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [1, 0, data]})
            elif type == "reactor":
                self.bluePowerlinesActive[field][1] = True
                if self.reactorFilled:
                    data = POWERLINE_SCORING_BLUE
                self.blueReactor_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [1, 1, data]})
            elif type == "combustion":
                self.bluePowerlinesActive[field][2] = True
                if self.combustionScoringTime[1] > 0:
                    print("Combustion scoring!")
                    data = POWERLINE_SCORING_BLUE
                self.blueCombustion_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [1, 2, data]})
            elif type == "coop":
                self.bluePowerlinesActive[field][3] = True
                if self.redPowerlinesActive[field][3]:
                    data = COOP_SUCCESS
                else:
                    data = COOP_BLUE_HALF
                self.coop_PWM[field] = data
                if not self.manualMode:
                    toGuiStack.put({"PWM": [2, 3, data]})
            else:
                raise ValueError("powerline type passed into setLEDPWM DNE")
        else:
            raise ValueError("powerline alliance passed into setLEDPWM DNE")

    def stopMotor(self, alliance):
        if self.fieldNum != 0 and self.fieldNum != 1:
            raise ValueError("Field argument passed into setLEDPWM is not 0 or 1.")
        if alliance == "red":
            self.redRotorEnable[self.fieldNum] = False
        elif alliance == "blue":
            self.blueRotorEnable[self.fieldNum] = False
        else:
            raise ValueError("motor alliance passed into stopMotor DNE")

    def stopAllMotorsInCurrentField(self):
        self.stopMotor("red")
        self.stopMotor("blue")
        self.redRotor[self.fieldNum].resetEncoder(self.fieldNum)
        self.blueRotor[self.fieldNum].resetEncoder(self.fieldNum)
        toGuiStack.put("resetRotors")

    def setAllPWMInField(self, field, data):
        self.redWind_PWM[field] = data
        self.blueWind_PWM[field] = data
        self.redCombustion_PWM[field] = data
        self.blueCombustion_PWM[field] = data
        self.redReactor_PWM[field] = data
        self.blueReactor_PWM[field] = data
        self.coop_PWM[field] = data
        if not self.manualMode:
            toGuiStack.put({"FieldPWMs": [data, data, data, data, data, data, data]})

    def setLEDToFloorState(self, field):  #sets leds to active if they were scoring
        self.combustionScoringTime = [0, 0]

        if self.redWind_PWM[field] == POWERLINE_SCORING_RED:
            self.redWind_PWM[field] = POWERLINE_ACTIVE_RED
            if not self.manualMode:
                toGuiStack.put({"PWM": [0, 0, POWERLINE_ACTIVE_RED]})
        if self.blueWind_PWM[field] == POWERLINE_SCORING_BLUE:
            self.blueWind_PWM[field] = POWERLINE_ACTIVE_BLUE
            if not self.manualMode:
                toGuiStack.put({"PWM": [1, 0, POWERLINE_ACTIVE_BLUE]})

        if self.redCombustion_PWM[field] == POWERLINE_SCORING_RED:
            self.redCombustion_PWM[field] = POWERLINE_ACTIVE_RED
            if not self.manualMode:
                toGuiStack.put({"PWM": [0, 2, POWERLINE_ACTIVE_RED]})
        if self.blueCombustion_PWM[field] == POWERLINE_SCORING_BLUE:
            self.blueCombustion_PWM[field] = POWERLINE_ACTIVE_BLUE
            if not self.manualMode:
                toGuiStack.put({"PWM": [1, 2, POWERLINE_ACTIVE_BLUE]})

        if self.redReactor_PWM[field] == POWERLINE_SCORING_RED:
            self.redReactor_PWM[field] = POWERLINE_ACTIVE_RED
            if not self.manualMode:
                toGuiStack.put({"PWM": [0, 1, POWERLINE_ACTIVE_RED]})
        if self.blueReactor_PWM[field] == POWERLINE_SCORING_BLUE:
            self.blueReactor_PWM[field] = POWERLINE_ACTIVE_BLUE
            if not self.manualMode:
                toGuiStack.put({"PWM": [1, 1, POWERLINE_ACTIVE_BLUE]})

    def stopAllInField(self, field):
        self.stopAllMotorsInCurrentField()
        self.setAllPWMInField(field, DEFAULT_PWM) # or whatever default pwm val
        self.redPowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.bluePowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.coopStatus = [False, False]  # red?, blue?
        self.reactorFilled = False
        self.combustionScoringTime = [0, 0]
        toGuiStack.put("resetRotors")

    def fieldClear(self, field):
        self.stopAllMotorsInCurrentField()
        self.setAllPWMInField(field, FIELD_CLEAR) # or whatever default pwm val
        self.redPowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.bluePowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.coopStatus = [False, False]  # red?, blue?
        self.reactorFilled = False
        self.combustionScoringTime = [0, 0]
        toGuiStack.put("resetRotors")

    def setPrestart(self, field):
        self.stopAllMotorsInCurrentField()
        self.setAllPWMInField(field, BLACK)  # or whatever default pwm val
        self.redPowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.bluePowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.coopStatus = [False, False]  # red?, blue?
        self.reactorFilled = False
        self.combustionScoringTime = [0, 0]
        toGuiStack.put("resetRotors")

    def setStart(self, field):
        self.setAllPWMInField(field, DEFAULT_PWM)
        self.stopAllMotorsInCurrentField()
        toGuiStack.put("resetRotors")

    def fieldAbort(self, fieldNum):
        self.stopAllMotorsInCurrentField()
        self.setAllPWMInField(fieldNum, SOLID_RED)  # or whatever default pwm val
        self.redPowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.bluePowerlinesActive = [[False, False, False, False],
                                    [False, False, False, False]]
        self.coopStatus = [False, False]  # red?, blue?
        self.reactorFilled = False
        self.combustionScoringTime = [0, 0]
        toGuiStack.put("resetRotors")

    def fieldReview(self, fieldNum):
        self.stopAllMotorsInCurrentField()
        self.setLEDToFloorState(fieldNum)
        toGuiStack.put("resetRotors")

    def refresh(self):
        self.setupDone = False
        for i in range(0, len(self.commObj.listPorts()), 1):
            self.commObj.closeActivePort(i)

        self.commObj = []
        self.REVModules = []
        self.commObj = REVcomm()

        if self.flippedComOrder:  # if com port order has been detected to be opposite, list of ports will be something like ['COM23', 'COM24'}, so flip order of discovery
            port1 = 1
            port2 = 0
        else:
            port1 = 0
            port2 = 1

        if self.commObj.openActivePort(port1) == 0:
            if self.setup_field(port1) == 0:
                if self.commObj.openActivePort(port2) == 0:
                    if self.setup_field(port2) == 0:
                        if self.REVModules == -1:
                            self.controlMode = -1
                        elif len(self.REVModules) == 0:
                            toGuiStack.put("No USBs plugged in")
                            self.controlMode = -1
                        else:
                            self.controlMode = self.init_modules()
                            toGuiStack.put("Notes empty")
                        toGuiStack.put("refresh done")
                        self.setupDone = True
                    else:
                        toGuiStack.put("module discovery error")
                else:
                    toGuiStack.put("USB not plugged in")
            else:
                toGuiStack.put("module discovery error")
        else:
            toGuiStack.put("USB not plugged in")
        toGuiStack.put("refresh done")


if __name__ == '__main__':
    # socketStack = queue.Queue()
    guiStack = queue.Queue()
    toGuiStack = queue.Queue()
    app = FieldComms()
    if not app.stopAllThreads and app.setupDone:
        app.main()
