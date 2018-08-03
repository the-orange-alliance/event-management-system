import serial
import time
import binascii
import os
from serial.tools import list_ports

#Getting REV Ports..
global REVPorts
defaultComPort = 0
comPortCommand = ""

testFixture = False

class comPort:
    def __init__(self, sn, name):
        self.sn   = sn
        self.name = name

    def getSN (self):
        return self.sn

    def getNumber (self):
        return self.name

    def getName (self):
        return str(self.name)

def getPorts():

    comPorts = []

    device_list = list_ports.comports()
    numdevs = len(device_list)

    for usbDevice in device_list: #[2].split('=')[1]
        if 'SER=' in usbDevice.hwid:
            sections = usbDevice.hwid.split(' ')
            for section in sections:
                if 'SER=' in section:
                    serialNumber = section[4:]
                    deviceName = usbDevice.device
                    time.sleep(0.200)
                    comPorts.append(comPort( serialNumber, deviceName ))
    print(comPorts)
    return comPorts

def populateSerialPorts ():
    global defaultComPort
    global UUT_REV_PORT
    global TF_REV_PORT
    global serialPorts
    global REVPorts

    serialPorts = getPorts()
    REVPorts = []

    for port in serialPorts:
        if port.getSN().startswith("D") and (len(port.getSN()) > 2):
            REVPorts.append(port)
