import REVmessages as REVMsg
import REVMotor
import REVServo
import REVADC
import REVDIO
import REVI2C
import REVcomm as REVComm

class Module:
   def __init__( self, commObj, address, parent ):
      self.commObj = commObj
      self.address = address
      self.parent = parent
      self.motors = []
      self.servos = []
      self.i2cChannels = []
      self.adcPins = []
      self.dioPins = []
   
   def init_periphs( self, port ):
      for i in range( 0, 4 ):
         self.motors.append( REVMotor.Motor(self.commObj, i, self.address) )
         self.motors[-1].setMode(port, 0, 1)
         self.motors[-1].setPower(port, 0)

         self.i2cChannels.append( REVI2C.I2CChannel(self.commObj, i, self.address ) )

      for j in range( 0, 8 ):
         self.dioPins.append( REVDIO.DIOPin(port, self.commObj, j, self.address ) )

      for k in range( 0, 6 ):
         self.servos.append( REVServo.Servo( self.commObj, k, self.address ) )
         self.servos[-1].init(port)

      for l in range( 0, 4 ):
         self.adcPins.append( REVADC.ADCPin( self.commObj, l, self.address ) )

   def killSwitch (self, port):

      for i in range( 0, 4 ):
         self.motors[i].disable(port)

      for j in range( 0, 8 ):
         pass
         #self.dioPins.append( REVDIO.DIOPin( j, self.address ) )

      for k in range( 0, 6 ):
         self.servos[k].disable(port)

      for l in range( 0, 15 ):
         pass
         #self.adcPins.append( REVADC.ADCPin( self.commObj, l, self.address ) )


   def getParentStatus ( self ):
      return self.parent

   def getAddress ( self ):
      return self.address

   def getStatus ( self, port ):
      return self.commObj.getModuleStatus( port, self.address )

   def getModuleAddress ( self ):
      return self.address

   def sendKA ( self, port ):
      self.commObj.keepAlive( port, self.address )

   def sendFailSafe ( self, port ):
      self.commObj.failSafe( port, self.address )

   def setAddress ( self, port, newAddress):
      self.commObj.setNewModuleAddress( port, self.address, newAddress)

      self.address = newAddress
      for motor in self.motors:
         motor.setDestination( port, newAddress )
      for servo in self.servos:
         servo.setDestination( port, newAddress )
      for i2cChannel in self.i2cChannels:
         i2cChannel.setDestination( newAddress )
      for adcPin in self.adcPins:
         adcPin.setDestination( newAddress )
      for dioPin in self.dioPins:
         dioPin.setDestination( newAddress )

   def getInterface ( self, port, interface):
      return self.commObj.queryInterface( port, self.address, interface )

   def setLEDColor ( self, port, red, green, blue ):
      self.commObj.setModuleLEDColor( port, self.address, red, green, blue )

   def getLEDColor ( self, port ):
      return self.commObj.getModuleLEDColor( port, self.address )

   # TODO: setLEDPattern

   # TODO: getLEDPattern

   def setLogLevel ( self, port, group, verbosity ):
      self.commObj.debugLogLevel( port, self.address, group, verbosity )

   def getBulkData ( self, port ):
      return self.commObj.getBulkInputData( port, self.address )

   def enableCharging ( self, port ):
      self.commObj.phoneChargeControl( port, self.address, 1 )

   def disableCharging ( self, port ):
      self.commObj.phoneChargeControl( port, self.address, 0 )

   def chargingEnabled ( self, port ):
      return self.commObj.phoneChargeQuery( port, self.address )

   def debugOutput ( self, port, length, hint ):
      self.commObj.injectDataLogHint( port, self.address, length, hint )

   def setAllDIO ( self, values ):
      REVDIO.setAllDIOOutputs( self.address, values )

   def getAllDIO ( self ):
      return REVDIO.getAllDIOInputs( self.address )
      
   def getVersionString ( self, port ):
      return self.commObj.readVersionString( port, self.address )

   def setIMUBlockReadConfig ( self, startRegister, numberOfBytes, readInterval_ms ):
      REVI2C.imuBlockReadConfig( self.address, startRegister, numberOfBytes, readInterval_ms )

   def getIMUBlockReadConfig ( self ):
      return REVI2C.imuBlockReadQuery( self.address )

   def getBulkMotorData ( self, port ):
      return self.commObj.getBulkMotorData( port, self.address )

   def getBulkADCData ( self, port ):
      return self.commObj.getBulkADCData( port, self.address )

   def getBulkI2CData ( self, port ):
      return self.commObj.getBulkI2CData( port, self.address )

   def getBulkServoData ( self, port ):
      return self.commObj.getBulkServoData( port, self.address )
