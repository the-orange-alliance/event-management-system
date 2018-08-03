import REVcomm as REVComm
import REVmessages as REVMsg
import time

def i2cWriteSingleByte ( commObj, destination, i2cChannel, slaveAddress, byteToWrite ):
   i2cWriteSingleByteMsg = REVMsg.I2CWriteSingleByte()

   i2cWriteSingleByteMsg.payload.i2cChannel = i2cChannel
   i2cWriteSingleByteMsg.payload.slaveAddress = slaveAddress
   i2cWriteSingleByteMsg.payload.byteToWrite = byteToWrite

   commObj.sendAndReceive( i2cWriteSingleByteMsg, destination )

def i2cWriteMultipleBytes ( commObj, destination, i2cChannel, slaveAddress, numBytes, bytesToWrite ):
   i2cWriteMultipleBytesMsg = REVMsg.I2CWriteMultipleBytes()

   i2cWriteMultipleBytesMsg.payload.i2cChannel = i2cChannel
   i2cWriteMultipleBytesMsg.payload.slaveAddress = slaveAddress
   i2cWriteMultipleBytesMsg.payload.numBytes = numBytes
   i2cWriteMultipleBytesMsg.payload.bytesToWrite = bytesToWrite

   commObj.sendAndReceive( i2cWriteMultipleBytesMsg, destination )

def i2cWriteStatusQuery ( commObj, destination, i2cChannel ):
   i2cWriteStatusQueryMsg = REVMsg.I2CWriteStatusQuery()

   i2cWriteStatusQueryMsg.payload.i2cChannel = i2cChannel

   packet = commObj.sendAndReceive( i2cWriteStatusQueryMsg, destination )

   return packet.payload.i2cStatus, packet.payload.numBytes

def i2cReadSingleByte ( commObj, destination, i2cChannel, slaveAddress ):
   i2cReadSingleByteMsg = REVMsg.I2CReadSingleByte()

   i2cReadSingleByteMsg.payload.i2cChannel = i2cChannel
   i2cReadSingleByteMsg.payload.slaveAddress = slaveAddress

   commObj.sendAndReceive( i2cReadSingleByteMsg, destination )

def i2cReadMultipleBytes ( commObj, destination, i2cChannel, slaveAddress, numBytes ):
   i2cReadMultipleBytesMsg = REVMsg.I2CReadMultipleBytes()

   i2cReadMultipleBytesMsg.payload.i2cChannel = i2cChannel
   i2cReadMultipleBytesMsg.payload.slaveAddress = slaveAddress
   i2cReadMultipleBytesMsg.payload.numBytes = numBytes

   commObj.sendAndReceive( i2cReadMultipleBytesMsg, destination )

def i2cReadStatusQuery ( commObj, destination, i2cChannel ):
   i2cReadStatusQueryMsg = REVMsg.I2CReadStatusQuery()

   i2cReadStatusQueryMsg.payload.i2cChannel = i2cChannel

   packet = commObj.sendAndReceive( i2cReadStatusQueryMsg, destination )

   return packet.payload.i2cStatus, packet.payload.byteRead, packet.payload.payloadBytes

def i2cConfigureChannel ( commObj, destination, i2cChannel, speedCode ):
   i2cConfigureChannelMsg = REVMsg.I2CConfigureChannel()

   i2cConfigureChannelMsg.payload.i2cChannel = i2cChannel
   i2cConfigureChannelMsg.payload.speedCode = speedCode

   commObj.sendAndReceive( i2cConfigureChannelMsg, destination )

def i2cConfigureQuery ( commObj, destination, i2cChannel ):
   i2cConfigureQueryMsg = REVMsg.I2CConfigureQuery()

   i2cConfigureQueryMsg.payload.i2cChannel = i2cChannel

   packet = commObj.sendAndReceive( i2cConfigureQueryMsg, destination )

   return packet.payload.speedCode

def i2cBlockReadConfig ( commObj, destination, i2cChannel, address, startRegister, numberOfBytes, readInterval_ms ):
   i2cBlockReadConfigMsg = REVMsg.I2CBlockReadConfig()

   i2cBlockReadConfigMsg.channel = i2cChannel
   i2cBlockReadConfigMsg.address = address
   i2cBlockReadConfigMsg.startRegister = startRegister
   i2cBlockReadConfigMsg.numberOfBytes = numberOfBytes
   i2cBlockReadConfigMsg.readInterval_ms = readInterval_ms

   commObj.sendAndReceive( i2cBlockReadConfigMsg, destination )

def i2cBlockReadQuery ( commObj, destination ):
   i2cBlockReadQueryMsg = REVMsg.I2CBlockReadQuery()

   packet = commObj.sendAndReceive( i2cBlockReadQueryMsg, destination)

   return packet

def imuBlockReadConfig ( commObj, destination, startRegister, numberOfBytes, readInterval_ms ):
   imuBlockReadConfigMsg = REVMsg.IMUBlockReadConfig()

   imuBlockReadConfigMsg.startRegister = startRegister
   imuBlockReadConfigMsg.numberOfBytes = numberOfBytes
   imuBlockReadConfigMsg.readInterval_ms = readInterval_ms

   commObj.sendAndReceive( imuBlockReadConfigMsg, destination )

def imuBlockReadQuery ( commObj, destination ):
   imuBlockReadQueryMsg = REVMsg.IMUBlockReadQuery()

   packet = commObj.sendAndReceive( imuBlockReadQueryMsg, destination )

   return packet

class I2CChannel:
   def __init__ ( self, commObj, channel, destinationModule ):
      self.commObj = commObj
      self.channel = channel
      self.destinationModule = destinationModule
      self.devices = {}

   def setChannel ( self, channel ):
      self.channel = channel

   def getChannel ( self ):
      return self.channel

   def setDestination ( self, destinationModule ):
      self.destinationModule = destinationModule

   def getDestination ( self ):
      return self.destinationModule

   def addDevice ( self, address, name ):
      self.devices[ name ] = I2CDevice( self.commObj, self.channel, self.destinationModule, address )

   def addColorSensor ( self, name ):
      self.devices[ name ] = ColorSensor( self.commObj, self.channel, self.destinationModule )

   def addIMU ( self, name ):
      self.devices[ name ] = IMU( self.commObj, self.channel, self.destinationModule )

   def getDevices ( self ):
      return self.devices

   def setSpeed ( self, speedCode ):
      i2cConfigureChannel( self.destinationModule, self.channel, speedCode )

      return i2cConfigureQuery( self.destinationModule, self.channel )

class I2CDevice:
   def __init__(self, commObj, channel, destinationModule, address ):
      self.commObj = commObj
      self.channel = channel
      self.destinationModule = destinationModule
      self.address = address

   def setChannel ( self, channel ):
      self.channel = channel

   def getChannel ( self ):
      return self.channel

   def setDestination ( self, destinationModule ):
      self.destinationModule = destinationModule

   def getDestination ( self ):
      return self.destinationModule

   def setAddress ( self, address ):
      self.address = address

   def getAddress ( self ):
      return self.address

   def writeByte ( self, byteToWrite ):
      i2cWriteSingleByte( self.commObj, self.destinationModule, self.channel, self.address, byteToWrite )

   def writeMultipleBytes ( self, numBytes, bytesToWrite ):
      #assert( numBytes == len(bytesToWrite), "Number of Bytes does not match requested payload" )

      i2cWriteMultipleBytes( self.commObj, self.destinationModule, self.channel, self.address, numBytes, bytesToWrite )

      #i2cWriteStatusQuery( self.destinationModule, self.channel) 
      # TODO: Make I2C Query Smart. This function should not exit without receiving an ACK from the module.
      # TODO: Implement Error Detection.
   def readByte ( self ):
      i2cReadSingleByte( self.commObj, self.destinationModule, self.channel, self.address )

      return int(i2cReadStatusQuery( self.commObj, self.destinationModule, self.channel )[ 2 ]) & 0xFF

   def readMultipleBytes ( self, numBytes ):
      i2cReadMultipleBytes( self.commObj, self.destinationModule, self.channel, self.address, numBytes )

      byteMask = "0x"
      for i in range(0, numBytes):
         byteMask += "FF"

      return int(i2cReadStatusQuery( self.commObj, self.destinationModule, self.channel )[ 2 ]) & (int(byteMask, 16))

   def setBlockReadConfig ( self, startRegister, numberOfBytes, readInterval_ms ):
      i2cBlockReadConfig( self.commObj, self.destinationModule, self.channel, self.address, startRegister, numberOfBytes, readInterval_ms )

   def getBlockReadConfig ( self ):
      return i2cBlockReadQuery( self.commObj, self.destinationModule )

######Color Sensor######

COMMAND_REGISTER_BIT = 0x80

SINGLE_BYTE_BIT = 0x00
MULTI_BYTE_BIT = 0x20

COLOR_SENSOR_ADDRESS = (0x39)

ENABLE_REGISTER   = 0x00
ATIME_REGISTER    = 0x01
WTIME_REGISTER    = 0x03
AILTL_REGISTER    = 0x04
AILTH_REGISTER    = 0x05
AIHTL_REGISTER    = 0x06
AIHTH_REGISTER    = 0x07
PILTL_REGISTER    = 0x08
PILTH_REGISTER    = 0x09
PIHTL_REGISTER    = 0x0A
PIHTH_REGISTER    = 0x0B
PERS_REGISTER     = 0x0C
CONFIG_REGISTER   = 0x0D
PPULSE_REGISTER   = 0x0E
CONTROL_REGISTER  = 0x0F
REVISION_REGISTER = 0x11
ID_REGISTER       = 0x12
STATUS_REGISTER   = 0x13
CDATA_REGISTER    = 0x14
CDATAH_REGISTER   = 0x15
RDATA_REGISTER    = 0x16
RDATAH_REGISTER   = 0x17
GDATA_REGISTER    = 0x18
GDATAH_REGISTER   = 0x19
BDATA_REGISTER    = 0x1A
BDATAH_REGISTER   = 0x1B
PDATA_REGISTER    = 0x1C
PDATAH_REGISTER   = 0x1D

class ColorSensor( I2CDevice ):
   def __init__ ( self, commObj, channel, destinationModule ):
      I2CDevice.__init__( self, commObj, channel, destinationModule, COLOR_SENSOR_ADDRESS )

   def initSensor( self ):
      self.writeByte( COMMAND_REGISTER_BIT | ENABLE_REGISTER )
      self.writeByte( 0x07 )
      self.writeByte( COMMAND_REGISTER_BIT | ATIME_REGISTER )
      self.writeByte( 0xFF )
      self.writeByte( COMMAND_REGISTER_BIT | PPULSE_REGISTER )
      self.writeByte( 0x08 )

   def getEnable ( self ):
      self.writeByte( COMMAND_REGISTER_BIT | ENABLE_REGISTER )
      byte1 = self.readByte()

      return byte1

   def getDominantColor(self):
      time.sleep(.05)

      clear = self.getClearValue()
      red = self.getRedValue()
      green = self.getGreenValue()
      blue = self.getBlueValue()

      RED = 0
      GREEN = 2
      BLUE = 1
      
      if red > blue and red > green:
         print ("RED")
         return RED
      elif blue > red and blue > green:
         print ("BLUE")
         return BLUE
      elif green > red and green > blue:
         print ("GREEN")
         return GREEN
      else:
         return -1

   def getDeviceID( self ):
      self.writeByte( COMMAND_REGISTER_BIT | MULTI_BYTE_BIT | ID_REGISTER )

      return self.readByte()

   def getGreenValue( self ):
      return self.getRegisterValue( GDATA_REGISTER )

   def getRedValue( self ):
      return self.getRegisterValue( RDATA_REGISTER )

   def getBlueValue( self ):
      return self.getRegisterValue( BDATA_REGISTER )

   def getClearValue( self ):
      return self.getRegisterValue( CDATA_REGISTER )

   def getProxValue(self ):
      return self.getRegisterValue( PDATA_REGISTER )

   def getRegisterValue( self, register ):
      self.writeByte( COMMAND_REGISTER_BIT | MULTI_BYTE_BIT | register )

      return self.readMultipleBytes( 2 )

######On Board IMU######
IMU_ADDRESS = 0x28

#Controls which of the two register pages are visible
PAGE_ID = 0X07
CHIP_ID = 0x00
ACC_ID = 0x01
MAG_ID = 0x02
GYR_ID = 0x03
SW_REV_ID_LSB = 0x04
SW_REV_ID_MSB = 0x05
BL_REV_ID = 0X06

#Acceleration data register
ACC_DATA_X_LSB = 0X08
ACC_DATA_X_MSB = 0X09
ACC_DATA_Y_LSB = 0X0A
ACC_DATA_Y_MSB = 0X0B
ACC_DATA_Z_LSB = 0X0C
ACC_DATA_Z_MSB = 0X0D

#Magnetometer data register
MAG_DATA_X_LSB = 0X0E
MAG_DATA_X_MSB = 0X0F
MAG_DATA_Y_LSB = 0X10
MAG_DATA_Y_MSB = 0X11
MAG_DATA_Z_LSB = 0X12
MAG_DATA_Z_MSB = 0X13

#Gyro data registers
GYR_DATA_X_LSB = 0X14
GYR_DATA_X_MSB = 0X15
GYR_DATA_Y_LSB = 0X16
GYR_DATA_Y_MSB = 0X17
GYR_DATA_Z_LSB = 0X18
GYR_DATA_Z_MSB = 0X19

#Euler data registers
EUL_H_LSB = 0X1A
EUL_H_MSB = 0X1B
EUL_R_LSB = 0X1C
EUL_R_MSB = 0X1D
EUL_P_LSB = 0X1E
EUL_P_MSB = 0X1F

#Quaternion data registers
QUA_DATA_W_LSB = 0X20
QUA_DATA_W_MSB = 0X21
QUA_DATA_X_LSB = 0X22
QUA_DATA_X_MSB = 0X23
QUA_DATA_Y_LSB = 0X24
QUA_DATA_Y_MSB = 0X25
QUA_DATA_Z_LSB = 0X26
QUA_DATA_Z_MSB = 0X27

#Linear acceleration data registers
LIA_DATA_X_LSB = 0X28
LIA_DATA_X_MSB = 0X29
LIA_DATA_Y_LSB = 0X2A
LIA_DATA_Y_MSB = 0X2B
LIA_DATA_Z_LSB = 0X2C
LIA_DATA_Z_MSB = 0X2D

#Gravity data registers
GRV_DATA_X_LSB = 0X2E
GRV_DATA_X_MSB = 0X2F
GRV_DATA_Y_LSB = 0X30
GRV_DATA_Y_MSB = 0X31
GRV_DATA_Z_LSB = 0X32
GRV_DATA_Z_MSB = 0X33

#Temperature data register
TEMP = 0X34

#Status registers
CALIB_STAT = 0X35
SELFTEST_RESULT = 0X36
INTR_STAT = 0X37

SYS_CLK_STAT = 0X38
SYS_STAT = 0X39
SYS_ERR = 0X3A

#Unit selection register
UNIT_SEL = 0X3B
DATA_SELECT = 0X3C

#Mode registers
OPR_MODE = 0X3D
PWR_MODE = 0X3E

SYS_TRIGGER = 0X3F
TEMP_SOURCE = 0X40

#OPR_MODE Register Enums
CONFIGMODE = 0x00
ACCONLY = 0x01
MAGONLY = 0x02
GYROONLY = 0x03
ACCMAG = 0x04
ACCGYRO = 0x05
MAGGYRO = 0x06
AMG = 0x07
IMUMODE = 0x08
COMPASS = 0x09
M4G = 0x0A
NDOF_FMC_OFF = 0x0B
NDOF = 0x0C

#PWR_MODE Register Enums
NORMAL = 0x00
LOW_POWER = 0x01
SUSPEND = 0x02

#Axis remap registers
AXIS_MAP_CONFIG = 0X41
AXIS_MAP_SIGN = 0X42

#SIC registers
SIC_MATRIX_0_LSB = 0X43
SIC_MATRIX_0_MSB = 0X44
SIC_MATRIX_1_LSB = 0X45
SIC_MATRIX_1_MSB = 0X46
SIC_MATRIX_2_LSB = 0X47
SIC_MATRIX_2_MSB = 0X48
SIC_MATRIX_3_LSB = 0X49
SIC_MATRIX_3_MSB = 0X4A
SIC_MATRIX_4_LSB = 0X4B
SIC_MATRIX_4_MSB = 0X4C
SIC_MATRIX_5_LSB = 0X4D
SIC_MATRIX_5_MSB = 0X4E
SIC_MATRIX_6_LSB = 0X4F
SIC_MATRIX_6_MSB = 0X50
SIC_MATRIX_7_LSB = 0X51
SIC_MATRIX_7_MSB = 0X52
SIC_MATRIX_8_LSB = 0X53
SIC_MATRIX_8_MSB = 0X54

#Accelerometer Offset registers
ACC_OFFSET_X_LSB = 0X55
ACC_OFFSET_X_MSB = 0X56
ACC_OFFSET_Y_LSB = 0X57
ACC_OFFSET_Y_MSB = 0X58
ACC_OFFSET_Z_LSB = 0X59
ACC_OFFSET_Z_MSB = 0X5A

#Magnetometer Offset registers
MAG_OFFSET_X_LSB = 0X5B
MAG_OFFSET_X_MSB = 0X5C
MAG_OFFSET_Y_LSB = 0X5D
MAG_OFFSET_Y_MSB = 0X5E
MAG_OFFSET_Z_LSB = 0X5F
MAG_OFFSET_Z_MSB = 0X60

#Gyroscope Offset registers
GYR_OFFSET_X_LSB = 0X61
GYR_OFFSET_X_MSB = 0X62
GYR_OFFSET_Y_LSB = 0X63
GYR_OFFSET_Y_MSB = 0X64
GYR_OFFSET_Z_LSB = 0X65
GYR_OFFSET_Z_MSB = 0X66

#Radius registers
ACC_RADIUS_LSB = 0X67
ACC_RADIUS_MSB = 0X68
MAG_RADIUS_LSB = 0X69
MAG_RADIUS_MSB = 0X6A

#Selected Page 1 registers
ACC_CONFIG = 0x08
MAG_CONFIG = 0x09
GYR_CONFIG_0 = 0x0A
GYR_CONFIG_1 = 0x0B
ACC_SLEEP_CONFIG = 0x0C
GYR_SLEEP_CONFIG = 0x0D
INT_MSK = 0x0F
INT_EN = 0x10
ACC_AM_THRES = 0x11
ACC_INT_SETTINGS = 0x12
ACC_HG_DURATION = 0x13
ACC_HG_THRES = 0x14
ACC_NM_THRES = 0x15
ACC_NM_SET = 0x16
GRYO_INT_SETTING = 0x17
GRYO_HR_X_SET = 0x18
GRYO_DUR_ = 0x19
GRYO_HR_Y_SET = 0x1A
GRYO_DUR_Y = 0x1B
GRYO_HR_Z_SET = 0x1C
GRYO_DUR_Z = 0x1D
GRYO_AM_THRES = 0x1E
GRYO_AM_SET = 0x1F

UNIQUE_ID_FIRST = 0x50
UNIQUE_ID_LAST = 0x5F

class IMU( I2CDevice ):
   def __init__ ( self, commObj, channel, destinationModule ):
      I2CDevice.__init__( self, commObj, channel, destinationModule, IMU_ADDRESS )

   def getDeviceID ( self ):
      return self.getRegisterValue( CHIP_ID )

   def initSensor ( self ):
      self.setRegisterValue( OPR_MODE, CONFIGMODE )# Might not be necessary.
      self.setRegisterValue( PWR_MODE, NORMAL )
      self.setRegisterValue( SYS_TRIGGER, 0x80 )
      self.setRegisterValue( PAGE_ID, 0x01 )
      self.setRegisterValue( MAG_CONFIG, 0x0B )
      self.setRegisterValue( PAGE_ID, 0x00 )
      self.setRegisterValue( OPR_MODE, 0x1C )

      print (self.getRegisterValue( SYS_STAT ))

   def getTemperature( self ):
      return self.getRegisterValue( TEMP )

   def getGyroData_X ( self ):
      return self.getTwoByteRegisterValue( GYR_DATA_X_LSB )

   def getGyroData_Y ( self ):
      return self.getTwoByteRegisterValue( GYR_DATA_Y_LSB )

   def getGyroData_Z ( self ):
      return self.getTwoByteRegisterValue( GYR_DATA_Z_LSB )

   def getAccData_X ( self ):
      return self.getTwoByteRegisterValue( ACC_DATA_X_LSB )

   def getAccData_Y ( self ):
      return self.getTwoByteRegisterValue( ACC_DATA_Y_LSB )

   def getAccData_Z ( self ):
      return self.getTwoByteRegisterValue( ACC_DATA_Z_LSB )

   def getMagData_X ( self ):
      return self.getTwoByteRegisterValue( MAG_DATA_X_LSB )

   def getMagData_Y ( self ):
      return self.getTwoByteRegisterValue( MAG_DATA_Y_LSB )

   def getMagData_Z ( self ):
      return self.getTwoByteRegisterValue( MAG_DATA_Z_LSB )

   def getAllEuler ( self ):
      values = self.getSixByteRegisterValue( EUL_H_LSB )
      new_values = []
      for value in values:
         #value = (int(value) / int(5760))
         new_values.append(str((float(value)/5760.0)*360.0))
      return new_values

   def getAllLinAccel (self):
      values = self.getSixByteRegisterValue( LIA_DATA_X_LSB )
      new_values = []
      for value in values:
         #value = (int(value) / int(5760))
         new_values.append(str(float(value)))
      return new_values

   def setRegisterValue ( self, register, value ):
      self.writeMultipleBytes( 2, ( register ) + (value << 8) )

   def getRegisterValue ( self, register ):
      self.writeByte( register )

      return self.readByte()

   def getTwoByteRegisterValue ( self, register ):
      self.writeByte( register )

      val = int(self.readMultipleBytes( 2 ))
      bits = int(16)

      if (val & (1 << (bits - 1))) != 0: # if sign bit is set e.g., 8bit: 128-255
         val = val - (1 << bits)        # compute negative value

      return val

   def getSixByteRegisterValue ( self, register ):
      self.writeByte( register )

      val = long(self.readMultipleBytes( 6 ))
      bits = long(16)

      values = []

      for i in range(0,3):
         it_val = val & 0xFFFF
         
         if (it_val & (1 << (bits - 1))) != 0: # if sign bit is set e.g., 8bit: 128-255
            it_val = it_val - (1 << bits)        # compute negative value

         values.append(it_val)
         val = val >> 16

      return values
