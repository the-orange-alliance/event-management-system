import REVcomm as REVComm
import REVmessages as REVMsg
import REVModule
import REVADC

import time

Q16 = 65536.0

#Motor Mode Constants
MODE_CONSTANT_POWER    = 0
MODE_CONSTANT_VELOCITY = 1
MODE_POSITION_TARGET   = 2
MODE_CONSTANT_CURRENT  = 3

#Zero Behavior Constants
BRAKE_AT_ZERO          = 0
FLOAT_AT_ZERO          = 1

#Offsets
VELOCITY_OFFSET        = 6
CURRENT_OFFSET         = 8

#~~~~~~~~~~~~~~~~~~~~~~~~Command Definitions~~~~~~~~~~~~~~~~~~~~~~~~#
def setMotorChannelMode ( port, commObj, destination, motorChannel, motorMode, floatAtZero ):
   setMotorChannelModeMsg = REVMsg.SetMotorChannelMode()

   setMotorChannelModeMsg.payload.motorChannel = motorChannel
   setMotorChannelModeMsg.payload.motorMode = motorMode
   setMotorChannelModeMsg.payload.floatAtZero = floatAtZero

   commObj.sendAndReceive( port, setMotorChannelModeMsg, destination )

def getMotorChannelMode (port, commObj, destination, motorChannel ):
   getMotorChannelModeMsg = REVMsg.GetMotorChannelMode()

   getMotorChannelModeMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorChannelModeMsg, destination )

   return packet.payload.motorChannelMode, packet.payload.floatAtZero

def setMotorChannelEnable (port, commObj, destination, motorChannel, enabled ):
   setMotorChannelEnableMsg = REVMsg.SetMotorChannelEnable()

   setMotorChannelEnableMsg.payload.motorChannel = motorChannel
   setMotorChannelEnableMsg.payload.enabled = enabled

   packet = commObj.sendAndReceive( port, setMotorChannelEnableMsg, destination )

def getMotorChannelEnable (port, commObj, destination, motorChannel ):
   getMotorChannelEnableMsg = REVMsg.GetMotorChannelEnable()

   getMotorChannelEnableMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorChannelEnableMsg, destination )

   return packet.payload.enabled

def setMotorChannelCurrentAlertLevel (port, commObj, destination, motorChannel, currentLimit ):
   setMotorChannelCurrentAlertLevelMsg = REVMsg.SetMotorChannelCurrentAlertLevel()

   setMotorChannelCurrentAlertLevelMsg.payload.motorChannel = motorChannel
   setMotorChannelCurrentAlertLevelMsg.payload.currentLimit = currentLimit

   commObj.sendAndReceive( port, setMotorChannelCurrentAlertLevelMsg, destination )

def getMotorChannelCurrentAlertLevel (port, commObj, destination, motorChannel ):
   getMotorChannelCurrentAlertLevelMsg = REVMsg.GetMotorChannelCurrentAlertLevel()

   getMotorChannelCurrentAlertLevelMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorChannelCurrentAlertLevelMsg, destination )

   return packet.payload.currentLimit

def resetMotorEncoder ( port, commObj, destination, motorChannel ):
   resetMotorEncoderMsg = REVMsg.ResetMotorEncoder()

   resetMotorEncoderMsg.payload.motorChannel = motorChannel

   commObj.sendAndReceive( port, resetMotorEncoderMsg, destination )

def setMotorConstantPower ( port, commObj, destination, motorChannel, powerLevel ):
   setMotorConstantPowerMsg = REVMsg.SetMotorConstantPower()

   setMotorConstantPowerMsg.payload.motorChannel = motorChannel
   setMotorConstantPowerMsg.payload.powerLevel = powerLevel

   commObj.sendAndReceive( port, setMotorConstantPowerMsg, destination )

def getMotorConstantPower ( port, commObj, destination, motorChannel ):
   getMotorConstantPowerMsg = REVMsg.GetMotorConstantPower()

   getMotorConstantPowerMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorConstantPowerMsg, destination )

   return packet.payload.powerLevel

def setMotorTargetVelocity ( port, commObj, destination, motorChannel, velocity ):
   setMotorTargetVelocityMsg = REVMsg.SetMotorTargetVelocity()

   setMotorTargetVelocityMsg.payload.motorChannel = motorChannel
   setMotorTargetVelocityMsg.payload.velocity = velocity

   commObj.sendAndReceive( port, setMotorTargetVelocityMsg, destination )

def getMotorTargetVelocity ( port, commObj, destination, motorChannel ):
   getMotorTargetVelocityMsg = REVMsg.GetMotorTargetVelocity()

   getMotorTargetVelocityMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorTargetVelocityMsg, destination )

   return packet.payload.velocity

def setMotorTargetPosition ( port, commObj, destination, motorChannel, position, atTargetTolerance ):
   setMotorTargetPositionMsg = REVMsg.SetMotorTargetPosition()

   setMotorTargetPositionMsg.payload.motorChannel = motorChannel
   setMotorTargetPositionMsg.payload.position = position
   setMotorTargetPositionMsg.payload.atTargetTolerance = atTargetTolerance

   commObj.sendAndReceive( port, setMotorTargetPositionMsg, destination )

def getMotorTargetPosition ( port, ommObj, destination, motorChannel ):
   getMotorTargetPositionMsg = REVMsg.GetMotorTargetPosition()

   getMotorTargetPositionMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorTargetPositionMsg, destination )

   return packet.payload.targetPosition, packet.payload.atTargetTolerance

def getMotorAtTarget ( port, commObj, destination, motorChannel ):
   getMotorAtTargetMsg = REVMsg.GetMotorAtTarget()

   getMotorAtTargetMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorAtTargetMsg, destination )

   return packet.payload.atTarget

def getMotorEncoderPosition ( port, commObj, destination, motorChannel ):
   getMotorEncoderPositionMsg = REVMsg.GetMotorEncoderPosition()

   getMotorEncoderPositionMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getMotorEncoderPositionMsg, destination )

   val = int(packet.payload.currentPosition)
   bits = int(32)

   if (val & (1 << (bits - 1))) != 0: # if sign bit is set e.g., 8bit: 128-255
      val = val - (1 << bits)        # compute negative value

   return val

def setMotorPIDCoefficients ( port, commObj, destination, motorChannel, mode, p, i, d ):
   setMotorPIDCoefficientsMsg = REVMsg.SetMotorPIDCoefficients()

   setMotorPIDCoefficientsMsg.payload.motorChannel = motorChannel
   setMotorPIDCoefficientsMsg.payload.mode = mode
   setMotorPIDCoefficientsMsg.payload.p = p * Q16
   setMotorPIDCoefficientsMsg.payload.i = i * Q16
   setMotorPIDCoefficientsMsg.payload.d = d * Q16

   commObj.sendAndReceive( port, setMotorPIDCoefficientsMsg, destination )

def getMotorPIDCoefficients ( port, commObj, destination, motorChannel, mode ):
   getMotorPIDCoefficientsMsg = REVMsg.GetMotorPIDCoefficients()

   getMotorPIDCoefficientsMsg.payload.motorChannel = motorChannel
   getMotorPIDCoefficientsMsg.payload.mode = mode

   packet = commObj.sendAndReceive( port, getMotorPIDCoefficientsMsg, destination )

   p = int(packet.payload.p) / Q16
   i = int(packet.payload.i) / Q16
   d = int(packet.payload.d) / Q16

   return p, i, d

def getBulkPIDData ( port, commObj, destination, motorChannel ):
   getBulkPIDDataMsg = REVMsg.GetBulkPIDData()

   getBulkPIDDataMsg.payload.motorChannel = motorChannel

   packet = commObj.sendAndReceive( port, getBulkPIDDataMsg, destination )

   return packet

   '''
   return { packet.payload.motorCurPterm,
            packet.payload.motorCurIterm,
            packet.payload.motorCurDterm,
            packet.payload.motorCurOutput,
            packet.payload.motorCurCmd,
            packet.payload.motorCurError,
            packet.payload.motorVelPterm,
            packet.payload.motorVelIterm,
            packet.payload.motorVelDterm,
            packet.payload.motorVelOutput,
            packet.payload.motorVelCmd,
            packet.payload.motorVelError,
            packet.payload.motorPosPterm,
            packet.payload.motorPosIterm,
            packet.payload.motorPosDterm,
            packet.payload.motorPosOutput,
            packet.payload.motorPosCmd,
            packet.payload.motorPosError,
            packet.payload.monotonicTime }
   '''

#~~~~~~~~~~~~~~~~~~~~~~~Helper Functions~~~~~~~~~~~~~~~~~~~~~~~~#
def setCurrentPIDCoefficients ( port, commObj, destination, motorChannel, p, i, d ):
   getMotorPIDCoefficients( port, commObj, destination, motorChannel, 3, p, i, d )

def setVelocityPIDCoefficients ( port, commObj, destination, motorChannel, p, i, d ):
   setMotorPIDCoefficients( port, commObj, destination, motorChannel, 1, p, i, d )

def setPositionPIDCoefficients ( port, commObj, destination, motorChannel, p, i, d ):
   setMotorPIDCoefficients( port, commObj, destination, motorChannel, 2, p, i, d )

def getCurrentPIDCoefficients ( port, commObj, destination, motorChannel ):
   return getMotorPIDCoefficients( port, commObj, destination, motorChannel, 3 )

def getVelocityPIDCoefficients ( port, commObj, destination, motorChannel ):
   return getMotorPIDCoefficients( port, commObj, destination, motorChannel, 1 )

def getPositionPIDCoefficients ( port, commObj, destination, motorChannel ):
   return getMotorPIDCoefficients( port, commObj, destination, motorChannel, 2 )

#~~~~~~~~~~~~~~~~~~~~~~~Class Definition~~~~~~~~~~~~~~~~~~~~~~~~#
class Motor:  
   def __init__( self, commObj, channel, destinationModule ):
      self.channel = channel
      self.destinationModule = destinationModule
      self.commObj = commObj

      self.motorCurrent = REVADC.ADCPin( self.commObj, 8+channel, self.destinationModule )

   def setDestination ( self, destinationModule ):
      self.destinationModule = destinationModule
      
      self.motorCurrent.setDestination(destinationModule)

   def getDestination ( self ):
      return self.destinationModule

   def setChannel ( self, channel ):
      self.channel = channel

   def getChannel ( self ):
      return self.channel

   def setMode ( self, port, mode, zeroFloat ):
      setMotorChannelMode (port, self.commObj, self.destinationModule, self.channel, mode, zeroFloat )

   def getMode ( self, port ):
      return getMotorChannelMode (port, self.commObj, self.destinationModule, self.channel )

   def enable ( self, port ):
      setMotorChannelEnable(port, self.commObj, self.destinationModule, self.channel, 1 )

   def disable ( self, port ):
      setMotorChannelEnable(port, self.commObj, self.destinationModule, self.channel, 0 )

   def isEnabled ( self, port ):
      return getMotorChannelEnable(port, self.commObj, self.destinationModule, self.channel )

   def setCurrentLimit ( self, port, limit ):
      setMotorChannelCurrentAlertLevel(port, self.commObj, self.destinationModule, self.channel, limit )

   def getCurrentLimit ( self, port ):
      return getMotorChannelCurrentAlertLevel( port, self.commObj, self.destinationModule, self.channel )

   def resetEncoder ( self, port ):
      resetMotorEncoder( port, self.commObj, self.destinationModule, self.channel )

   def setPower ( self, port, powerLevel ):
      setMotorConstantPower( port, self.commObj, self.destinationModule, self.channel, powerLevel )

   def getPower ( self, port ):
      return getMotorConstantPower( port, self.commObj, self.destinationModule, self.channel )

   def setTargetCurrent ( self, current ):
      self.setCurrentLimit( current )

   def getTargetCurrent ( self ):
      return self.getCurrentLimit()

   def setTargetVelocity ( self, port, velocity ):
      setMotorTargetVelocity( port, self.commObj, self.destinationModule, self.channel, velocity )

   def getTargetVelocity ( self, port ):
      return getMotorTargetVelocity( port, self.commObj, self.destinationModule, self.channel )

   def setTargetPosition ( self, port, position, tolerance ):
      setMotorTargetPosition( port, self.commObj, self.destinationModule, self.channel, position, tolerance )

   def getTargetPosition ( self, port ):
      return getMotorTargetPosition( port, self.commObj, self.destinationModule, self.channel )

   def isAtTarget ( self, port ):
      return getMotorAtTarget( port, self.commObj, self.destinationModule, self.channel )

   def getPosition ( self, port ):
      position = getMotorEncoderPosition( port, self.commObj, self.destinationModule, self.channel )

      return position

   def resetPosition ( self, port ):
      resetMotorEncoder( port, self.commObj, self.destinationModule, self.channel )

   def getVelocity ( self, port ):
      bulkData = REVModule.getBulkInputData( port, self.commObj, self.destinationModule )

      val = int(bulkData[ self.channel + VELOCITY_OFFSET ])
      bits = int(16)

      if (val & (1 << (bits - 1))) != 0: # if sign bit is set e.g., 8bit: 128-255
         val = val - (1 << bits)        # compute negative value

      return val

   def getCurrent ( self ):
      return self.motorCurrent.getADC( 0 )

   def setCurrentPID ( self, port, p, i, d ):
      setCurrentPIDCoefficients( port, self.commObj, self.destinationModule, self.channel, p, i, d )

   def getCurrentPID ( self, port ):
      return getCurrentPIDCoefficients( port, self.commObj, self.destinationModule, self.channel )

   def setVelocityPID ( self, port, p, i, d ):
      setVelocityPIDCoefficients( port, self.commObj, self.destinationModule, self.channel, p, i, d )

   def getVelocityPID ( self, port ):
      return getVelocityPIDCoefficients( port, self.commObj, self.destinationModule, self.channel )

   def setPositionPID ( self, port, p, i, d ):
      setPositionPIDCoefficients( port, self.commObj, self.destinationModule, self.channel, p, i, d )

   def getPositionPID ( self, port ):
      return getPositionPIDCoefficients( port, self.commObj, self.destinationModule, self.channel )

   def getBulkPIDData ( self, port ):
      return getBulkPIDData( port, self.commObj, self.destinationModule, self.channel )

   def init ( self, port ):
      self.setMode( port, 0, 1 )
      self.setPower( port, 0 )
      self.enable(port)
