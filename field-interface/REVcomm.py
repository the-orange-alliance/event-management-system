
import threading
import multiprocessing as mp
import time
import math
import csv
import REVComPorts
import REVmessages as REVMsg
import os
import REVModule
from REVModule import Module
import binascii
import serial
import time
import Queue

class REVcomm():

    def __init__(self):
        self.serialReceive_Thread = False

        self.FunctionReturnTime = 0
        self.msgNum = 1

        self.totalTime = 0

        self.rxQueue = mp.Queue(256)
        self.txQueue = mp.Queue(256)

        self.roundTripAverage = 0
        self.numMsgs = 0

        self.enablePrinting = False

        self.msgSendTime = 0
        self.msgRcvTime = 0

        self.discoveryTimeout = 0.500

        self.averageMsgTime = 0

        self.REVProcessors = [serial.Serial(baudrate=460800, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE,
                                            stopbits=serial.STOPBITS_ONE),
                              serial.Serial(baudrate=460800, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE,
                                            stopbits=serial.STOPBITS_ONE)]

    def listPorts( self ): # listed from highest to lowest com port
        REVComPorts.populateSerialPorts()
        return REVComPorts.REVPorts

    def setActivePortBySN ( self, sn ):
        REVComPorts.populateSerialPorts()
        for port in REVComPorts.serialPorts:
            if port.getSN() == sn:
                setActivePort(port)

    def openActivePort (self, port): # be careful. may need to pass same port if cables not plugged before start
        numSerialErrors = 3

        #print "start thread with" + self.listPorts()[0].getName()

        #self.serialReceive_Thread = mp.Process( target=self.SendReceive, args=(self.txQueue, self.rxQueue, self.listPorts()[0].getName(),))
        #self.serialReceive_Thread.start()

        portsList = self.listPorts()
        # listed from highest to lowest com port
        if len(portsList) == 0:
            return -1
        while not self.REVProcessors[port].isOpen():
            try:
                print("Port '" + str(portsList[port].getName()) + "' Opening.")
                self.REVProcessors[port].port = portsList[port].getName()
            except IndexError:
                return -1
            try:
                self.REVProcessors[port].open()
            except serial.SerialException:
                print ("Serial port error, trying again. Port = " + str(portsList[port].getName()))
                numSerialErrors -= 1
                if numSerialErrors == 0:
                    return -1
                time.sleep(1)
        return 0

    def closeActivePort (self, port):
        #print "serial port closing"

        self.REVProcessors[port].close()

    def getTime_ms( self ):
        return int(round(time.time() * 1000))

    def getTime_ms( self ):
        return int( round( time.time() * 1000 ) )

    def sendAndReceive ( self, port, PacketToWrite, destination):
        numSerialErrors = 5
        self.WaitForFrameByte1 = 1
        self.WaitForFrameByte2 = 2
        self.WaitForPacketLengthByte1 = 3
        self.WaitForPacketLengthByte2 = 4
        self.WaitForDestByte = 5
        self.WaitForSourceByte = 6
        self.WaitForMsgNumByte = 7
        self.WaitForRefNumByte = 8
        self.WaitForPacketTypeByte = 9
        self.WaitForPayloadBytes = 10

        parseState = 1

        self.parseState = self.WaitForFrameByte1
        incomingPacket = ""
        packetLength = 0

        msgNum = 0
        retry = True

        readingBytesStart = 0
        readingBytesEnd = 0

        discoveryTimeout = 1000

        rcvStarted = False
        startReceiveTime = self.getTime_ms()

        receivedMessageNums = []

        inWaitingQueue = Queue.Queue()

        beenInLoop = False

        try:
            # sending queue
            retryAttempt = 0
            while retry:

                #print "doing a send"
                sendAndReceiveStart = time.time()

                PacketToWrite.header.destination = destination

                if isinstance( PacketToWrite, REVMsg.REVPacket ):
                    MaxRetries = 3

                    RetryTimeout_s = 1 # Ack timeout should be less than a keep alive timeout.

                    # Assign message number and increment it
                    PacketToWrite.header.msgNum = msgNum
                    msgNum = ( msgNum + 1 ) % 256
                    if msgNum == 0:
                        msgNum = 1

                    printData = (PacketToWrite.header.packetType.data >> 8) | ((PacketToWrite.header.packetType.data % 256) << 8)

                    discoveryMode = False
                    if printData == REVMsg.MsgNum.Discovery:
                        #print "trying to discover"
                        discoveryMode = True

                    if self.enablePrinting:
                        print ("-->", REVMsg.printDict[ printData ]["Name"], "::", PacketToWrite.getPacketData())
                    self.REVProcessors[port].write( binascii.unhexlify( PacketToWrite.getPacketData() ) )

                    waitTimeStart = time.time()
                    timeout = False
                    while self.REVProcessors[port].inWaiting() == 0:
                        if time.time() - waitTimeStart > 1:
                            timeout = True
                            retryAttempt += 1
                            if retryAttempt > MaxRetries:
                                #print "Max retries, no dice."
                                retry = False
                            break

                    if timeout:
                        continue

                    time.sleep(0.03)

                    if discoveryMode:
                        #print "packet initialized"
                        packet = []
                    if self.REVProcessors[port].inWaiting() > 0:
                        #print "going in loop"
                        while self.REVProcessors[port].inWaiting() > 0:
                            #print "inwaiting: ", self.REVProcessor.inWaiting()
                            #print "discovery: ", discoveryMode
                            retry = False
                            newByte = binascii.hexlify( self.REVProcessors[port].read( 1 ) ).upper()

                            if ( parseState == self.WaitForFrameByte1 ):
                                rcvStarted = True
                                startReceiveTime = time.time()

                                if ( newByte == "44" ):
                                    parseState = self.WaitForFrameByte2

                            elif ( parseState == self.WaitForFrameByte2 ):

                                if ( newByte == "44" ):
                                    None # No State Change
                                elif ( newByte == "4B" ):
                                    parseState = self.WaitForPacketLengthByte1
                                else:
                                    #print "Invalid FRAME_BYTE received...back to FRAME_BYTE_1"
                                    parseState = self.WaitForFrameByte1

                            elif ( parseState == self.WaitForPacketLengthByte1 ):
                                incomingPacket = "444B" + newByte
                                lengthBytes = newByte

                                parseState = self.WaitForPacketLengthByte2

                            elif ( parseState == self.WaitForPacketLengthByte2):
                                incomingPacket += newByte
                                lengthBytes += newByte

                                lengthBytes = int(int(lengthBytes, 16) >> 8 | (int(lengthBytes, 16)%256) << 8)

                                if ( lengthBytes <= REVMsg.PAYLOAD_MAX_SIZE ):
                                    packetLength = lengthBytes
                                    parseState = self.WaitForPayloadBytes
                                    #print "Packet length: ", packetLength


                                elif ( newByte == "44"):
                                    parseState = self.WaitForFrameByte2
                                else:
                                    parseState = self.WaitForFrameByte1

                            elif ( parseState == self.WaitForPayloadBytes ):
                                # Continue to populate the message
                                incomingPacket += newByte
                                ##print incomingPacket

                                if ( ( ( len( incomingPacket ) ) / 2 ) == ( packetLength ) ):
                                    #print "All bytes received"
                                    msgRcvTime = time.time()
                                    receivedChkSum = int( incomingPacket[ -2 : ], 16 )


                                    chksumdata = self.checkPacket( incomingPacket, receivedChkSum )

                                    if ( chksumdata[0] ):
                                        newPacket = self.processPacket(incomingPacket)
                                        if self.enablePrinting: print ("<--", REVMsg.printDict[ int(newPacket.header.packetType) ]["Name"], "::", newPacket.getPacketData())
                                        if discoveryMode:
                                            #print "packet appended, discovery"
                                            packet.append(newPacket)
                                            time.sleep(2)
                                            #print "size packet[]: ", len(packet)
                                            if self.REVProcessors[port].inWaiting() > 0:
                                                pass
                                            else:
                                                return packet
                                        else:
                                            return newPacket
                                    else:
                                        print ("Invalid ChkSum: ", chksumdata[1], "==", chksumdata[2])

                                    rcvStarted = False
                                    parseState = self.WaitForFrameByte1

                else:
                    exit( "\n\n\n!!!Attempting to send something other than a REVPacket!!!\n\n\n" )

        except serial.SerialException:
            try:
                self.REVProcessors[port].close()
            except AttributeError:
                print("sendAndRecieve attribute error!!!!!")
            pass


    def checkResponse( self, receivedPacket, PacketToWrite ):
        packetType = int(receivedPacket.header.packetType)

        data = (PacketToWrite.header.packetType.data >> 8) | ((PacketToWrite.header.packetType.data % 256) << 8)

        responseExpected = REVMsg.printDict[ data ][ "Response" ]

        if packetType == responseExpected:
            if receivedPacket.header.refNum == PacketToWrite.header.msgNum:
                #Correct Response Received.
                return True
            elif packetType == REVMsg.RespNum.Discovery_RSP:
                #Discovery Response Received.
                return True
            else:
                print ("This response is for a different message. Sent: %d, Received: %d." % (receivedPacket.header.refNum, PacketToWrite.header.msgNum))
                return False
        elif packetType == REVMsg.MsgNum.NACK:
            printData = (PacketToWrite.header.packetType.data >> 8) | ((PacketToWrite.header.packetType.data % 256) << 8)
            print ("NACK Code: ", receivedPacket.payload.nackCode)
            print ("NACK'd Packet: ", REVMsg.printDict[ printData ]["Name"], "::", PacketToWrite.getPacketData())
            return False
        else:
            print ("Incorrect Response Type. Response Expected: ", binascii.hexlify(str(data)), ", Response Received: ", binascii.hexlify(str(packetType)))
            return False

    def checkPacket (self, incomingPacket, receivedChkSum ):
        calcChkSum = 0

        for bytePointer in range( 0, len(incomingPacket) - 2 , 2 ):
            calcChkSum += int( incomingPacket[ bytePointer : bytePointer + 2 ], 16 )
            calcChkSum %= 256

        return (( receivedChkSum == calcChkSum ), receivedChkSum, calcChkSum)

    def processPacket(self, incomingPacket ):
        packetFrameBytes = int( incomingPacket[REVMsg.REVPacket.FrameIndex_Start:REVMsg.REVPacket.FrameIndex_End], 16 )

        packetLength     = int( self.swapEndianess(incomingPacket[REVMsg.REVPacket.LengthIndex_Start:REVMsg.REVPacket.LengthIndex_End]), 16 )

        packetDest       = int( incomingPacket[REVMsg.REVPacket.DestinationIndex_Start:REVMsg.REVPacket.DestinationIndex_End], 16 )

        packetSrc        = int( incomingPacket[REVMsg.REVPacket.SourceIndex_Start:REVMsg.REVPacket.SourceIndex_End], 16 )

        packetMsgNum     = int( incomingPacket[REVMsg.REVPacket.MsgNumIndex_Start:REVMsg.REVPacket.MsgNumIndex_End], 16 )

        packetRefNum     = int( incomingPacket[REVMsg.REVPacket.RefNumIndex_Start:REVMsg.REVPacket.RefNumIndex_End], 16 )

        packetCommandNum = int( self.swapEndianess(incomingPacket[REVMsg.REVPacket.PacketTypeIndex_Start:REVMsg.REVPacket.PacketTypeIndex_End]), 16 )

        packetPayload    = incomingPacket[REVMsg.REVPacket.HeaderIndex_End: -2 ]

        packetChkSum     = int( incomingPacket[ -2 : ], 16 )

        newPacket = REVMsg.printDict[ packetCommandNum ][ "Packet" ]()
        newPacket.assignRawBytes( incomingPacket )

        newPacket.header.length = packetLength
        newPacket.header.destination = packetDest
        newPacket.header.source = packetSrc
        newPacket.header.msgNum = packetMsgNum
        newPacket.header.refNum = packetRefNum
        newPacket.header.packetType = packetCommandNum

        bytePointer = 0

        for payloadMember in newPacket.payload.getOrderedMembers():
            valueToAdd = REVMsg.REVBytes( len( payloadMember ) )

            valueToAdd.data = int( self.swapEndianess( packetPayload[ bytePointer : bytePointer + len(payloadMember) * 2] ), 16 )

            newPacket.payload.payloadMember = valueToAdd
            bytePointer = bytePointer + len(payloadMember) * 2

        return newPacket

    def swapEndianess (self, bytes ):
        swappedBytes = ""
        for bytePointer in range( 0, len(bytes), 2):
            thisByte = bytes[ bytePointer: bytePointer + 2 ]
            swappedBytes = thisByte + swappedBytes

        return swappedBytes

    def getModuleStatus (self, port, destination ):
        getModuleStatusMsg = REVMsg.GetModuleStatus()

        getModuleStatusMsg.payload.clearStatus = 1

        packet = self.sendAndReceive ( port, getModuleStatusMsg, destination )

        return packet.payload.motorAlerts

    def keepAlive (self, port, destination ):
        keepAliveMsg = REVMsg.KeepAlive()

        self.sendAndReceive( port, keepAliveMsg, destination )

    def failSafe (self, port, destination ):
        failSafeMsg = REVMsg.FailSafe()

        self.sendAndReceive( port, failSafeMsg, destination )

    def setNewModuleAddress (self, port, destination, moduleAddress ):
        setNewModuleAddressMsg = REVMsg.SetNewModuleAddress()

        setNewModuleAddressMsg.payload.moduleAddress = moduleAddress

        self.sendAndReceive( port, setNewModuleAddressMsg, destination )

    def queryInterface (self, port, destination, interfaceName ):
        queryInterfaceMsg = REVMsg.QueryInterface()

        queryInterfaceMsg.payload.interfaceName = interfaceName

        packet = self.sendAndReceive( port, queryInterfaceMsg, destination )

        return packet.payload.packetID, packet.numValues

    def setModuleLEDColor (self, port, destination, redPower, greenPower, bluePower ):
        setModuleLEDColorMsg = REVMsg.SetModuleLEDColor()

        setModuleLEDColorMsg.payload.redPower = redPower
        setModuleLEDColorMsg.payload.greenPower = greenPower
        setModuleLEDColorMsg.payload.bluePower = bluePower

        self.sendAndReceive( port, setModuleLEDColorMsg, destination )

    def getModuleLEDColor (self, port, destination ):
        getModuleLEDColorMsg = REVMsg.GetModuleLEDColor()

        packet = self.sendAndReceive( port, getModuleLEDColorMsg, destination )

        return packet.payload.redPower, packet.payload.greenPower, packet.payload.bluePower

    def setModuleLEDPattern (self, destination, stepArray ):
        setModuleLEDPatternMsg = REVMsg.SetModuleLEDPattern()

        for step in stepArray:
            # TODO: Figure out how to fill in the steps.
            pass

    def debugLogLevel (self, port, destination, groupNumber, verbosityLevel ):
        debugLogLevelMsg = REVMsg.DebugLogLevel()

        debugLogLevelMsg.payload.groupNumber = groupNumber
        debugLogLevelMsg.payload.verbosityLevel = verbosityLevel

        self.sendAndReceive( port, debugLogLevelMsg, destination )

    def discovery (self, port, index):
        self.discovered = REVMsg.Discovery()
        print(str(self.discovered))
        packets = self.sendAndReceive( port, self.discovered, 255 )

        REVModules = []

        try:
            for packet in packets:
                module = Module(self, packet.header.source, packet.payload.parent )
                module.setAddress(port, index)
                module.init_periphs(port)
                index = index + 1
                REVModules.append(module)
        except TypeError:
            print "Did not receive DiscoveryRSP Packet"
            return -1

        return REVModules

    def getBulkInputData ( self, port, destination ):
        getBulkInputDataMsg = REVMsg.GetBulkInputData()

        packet = self.sendAndReceive( port, getBulkInputDataMsg, destination )

        return packet
        '''
        return  ( packet.payload.digitalInputs,
                  packet.payload.motor0Encoder,
                  packet.payload.motor1Encoder,
                  packet.payload.motor2Encoder,
                  packet.payload.motor3Encoder,
                  packet.payload.motorStatus,
                  packet.payload.motor0Velocity,
                  packet.payload.motor1Velocity,
                  packet.payload.motor2Velocity,
                  packet.payload.motor3Velocity,
                  packet.payload.motor0Mode,
                  packet.payload.motor1Mode,
                  packet.payload.motor2Mode,
                  packet.payload.motor3Mode,
                  packet.payload.analogInput0,
                  packet.payload.analogInput1,
                  packet.payload.analogInput2,
                  packet.payload.analogInput3,
                  packet.payload.gpioCurrent_mA,
                  packet.payload.i2cCurrent_mA,
                  packet.payload.servoCurrent_mA,
                  packet.payload.batteryCurrent_mA,
                  packet.payload.motor0current_mA,
                  packet.payload.motor1current_mA,
                  packet.payload.motor2current_mA,
                  packet.payload.motor3current_mA,
                  packet.payload.mon5v_mV,
                  packet.payload.batteryVoltage_mV,
                  packet.payload.servo0cmd,
                  packet.payload.servo1cmd,
                  packet.payload.servo2cmd,
                  packet.payload.servo3cmd,
                  packet.payload.servo4cmd,
                  packet.payload.servo5cmd,
                  packet.payload.servo0framePeriod_us,
                  packet.payload.servo1framePeriod_us,
                  packet.payload.servo2framePeriod_us,
                  packet.payload.servo3framePeriod_us,
                  packet.payload.servo4framePeriod_us,
                  packet.payload.servo5framePeriod_us,
                  packet.payload.mototonicTime )
        '''

    def phoneChargeControl ( self, port, destination, enable ):
        phoneChargeControlMsg = REVMsg.PhoneChargeControl()

        phoneChargeControlMsg.payload.enable = enable

        self.sendAndReceive( port, phoneChargeControlMsg, destination )

    def phoneChargeQuery ( self, port, destination ):
        phoneChargeQueryMsg = REVMsg.PhoneChargeQuery()

        packet = self.sendAndReceive( port, phoneChargeQueryMsg, destination )

        return packet.payload.enable

    def injectDataLogHint ( self, port, destination, length, hintText ):
        injectDataLogHintMsg = REVMsg.InjectDataLogHint()

        injectDataLogHintMsg.payload.length = length
        injectDataLogHintMsg.payload.hintText = hintText

        self.sendAndReceive( port, injectDataLogHintMsg, destination )

    def readVersionString ( self, port, destination ):
        readVersionStringMsg = REVMsg.ReadVersionString()

        packet = self.sendAndReceive( port, readVersionStringMsg, destination )

        return packet.payload.versionString

    def getBulkMotorData ( self, port, destination ):
        getBulkMotorDataMsg = REVMsg.GetBulkMotorData()

        packet = self.sendAndReceive( port, getBulkMotorDataMsg, destination )

        return packet     # TODO: Make Bulk message responses Dicts

    def getBulkADCData ( self, port, destination ):
        getBulkADCDataMsg = REVMsg.GetBulkADCData()

        packet = self.sendAndReceive( port, getBulkADCDataMsg, destination )

        return packet     # TODO: Make Bulk message responses Dicts

    def getBulkI2CData ( self, port, destination ):
        getBulkI2CDataMsg = REVMsg.GetBulkI2CData()

        packet = self.sendAndReceive( port, getBulkI2CDataMsg, destination )

        return packet     # TODO: Make Bulk message responses Dicts

    def getBulkServoData ( self, port, destination ):
        getBulkServoDataMsg = REVMsg.GetBulkServoData()

        packet = self.sendAndReceive( port, getBulkServoDataMsg, destination )

        return packet     # TODO: Make Bulk message responses Dicts


