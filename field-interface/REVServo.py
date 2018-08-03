import REVmessages as REVMsg

def setServoConfiguration ( port, commObj, destination, servoChannel, framePeriod ):
   setServoConfigurationMsg = REVMsg.SetServoConfiguration()

   setServoConfigurationMsg.payload.servoChannel = servoChannel
   setServoConfigurationMsg.payload.framePeriod = framePeriod

   return commObj.sendAndReceive( port, setServoConfigurationMsg, destination )

def getServoConfiguration ( port, commObj, destination, servoChannel ):
   getServoConfigurationMsg = REVMsg.GetServoConfiguration()

   getServoConfigurationMsg.payload.servoChannel = servoChannel

   packet = commObj.sendAndReceive( port, getServoConfigurationMsg, destination )

   return packet.payload.framePeriod

def setServoPulseWidth( port, commObj, destination, servoChannel, pulseWidth ):
   setServoPulseWidthMsg = REVMsg.SetServoPulseWidth()

   setServoPulseWidthMsg.payload.servoChannel = servoChannel
   setServoPulseWidthMsg.payload.pulseWidth = pulseWidth

   return commObj.sendAndReceive( port, setServoPulseWidthMsg, destination )

def getServoPulseWidth ( port, commObj, destination, servoChannel ):
   getServoPulseWidthMsg = REVMsg.GetServoPulseWidth()

   getServoPulseWidthMsg.payload.servoChannel = servoChannel

   packet = commObj.sendAndReceive( port, getServoPulseWidthMsg, destination )

   return packet.payload.pulseWidth

def setServoEnable ( port, commObj, destination, servoChannel, enable ):
   setServoEnableMsg = REVMsg.SetServoEnable()

   setServoEnableMsg.payload.servoChannel = servoChannel
   setServoEnableMsg.payload.enable = enable

   return commObj.sendAndReceive( port, setServoEnableMsg, destination )

def getServoEnable ( port, commObj, destination, servoChannel ):
   getServoEnableMsg = REVMsg.GetServoEnable()

   getServoEnableMsg.payload.servoChannel = servoChannel

   packet = commObj.sendAndReceive( port, getServoEnableMsg, destination )

   return packet.payload.enabled

class Servo:
   def __init__ ( self, commObj, channel, destinationModule ):
      self.commObj = commObj
      self.destinationModule = destinationModule
      self.channel = channel

   def setDestination ( self, destinationModule ):
      self.destinationModule = destinationModule

   def getDestination ( self ):
      return self.destinationModule

   def setChannel ( self, channel ):
      self.channel = channel

   def getChannel ( self ):
      return self.channel

   def setPeriod ( self, port, period):
      setServoConfiguration( port, self.commObj, self.destinationModule, self.channel, period )

   def getPeriod ( self, port ):
      return getServoConfiguration( port, self.commObj, self.destinationModule, self.channel )

   def setPulseWidth ( self, port, pulseWidth):
      setServoPulseWidth( port, self.commObj, self.destinationModule, self.channel, pulseWidth )

   def getPulseWidth ( self, port ):
      return getServoPulseWidth( port, self.commObj, self.destinationModule, self.channel )

   def enable ( self, port ):
      errorCode = setServoEnable( port, self.commObj, self.destinationModule, self.channel, 1 )

   def disable ( self, port ):
      setServoEnable( port, self.commObj, self.destinationModule, self.channel, 0 )

   def isEnabled ( self, port ):
      return getServoEnable( port, self.commObj, self.destinationModule, self.channel )

   def init ( self, port  ):
      self.setPeriod( port, 20000 )

