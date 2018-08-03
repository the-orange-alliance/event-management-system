import REVcomm
from REVcomm import *
from socketIO_client_nexus import SocketIO
from threading import Thread, Timer
import socket

hostname = socket.gethostname()
HOST = socket.gethostbyname(hostname)  # Get my computer's IP
PORT = 8081


class OGTest():
    def __init__(self):
        self.socketio = SocketIO(HOST, PORT)
        self.val = 0
        self.socketio.on('connect', self.on_connect)
        self.socketio.on('disconnect', self.on_disconnect)
        self.socketio.on('reconnect', self.on_reconnect)
        self.socketio.on('onMatchPrestart', self.on_onPrestart)
        self.socketio.on('setLED', self.on_setLED)
        self.socketio.on('onWindCrank', self.on_onWindCrank)
        self.socketio.on('onMatchAbort', self.on_onMatchAbort)
        self.socketio.on('onMatchEnd', self.on_onMatchEnd)

        self.socket_thread = Thread(target=self._socket_thread)
        self.socket_thread.daemon = True
        self.main_thread = Thread(target=self._main_thread)
        self.main_thread.daemon = True

    def fxn(self):
        Timer(1.0, self.fxn).start()
        print("Hi")

    def _main_thread(self):
        print("Main")
        self.fxn()

    def _socket_thread(self):
        self.socketio.wait()

    def main(self):
        self.main_thread.start()
        self.socket_thread.start()
        self.socket_thread.join()

    def on_connect(self):
        print('[Connected]')


    def on_reconnect(self):
        print('[Reconnected]')


    def on_disconnect(self):
        print('[Disconnected]')


    def on_onPrestart(self, fieldNum):
        if fieldNum['fieldNum'] < 0 or fieldNum['fieldNum'] > 4:
            raise ValueError("Field num from socket is out of range")
        fn = None
        if fieldNum['fieldNum'] < 3:
            fn = fieldNum['fieldNum'] - 1
        else:
            fn = fieldNum['fieldNum'] - 3

        print('Field number: ' + str(fn))
        self.fieldNum = fn


    def on_onMatchAbort(self):
        print("Match Aborted.")


    def on_onMatchEnd(self):
        print("Match Ended.")


    def on_setLED(self, obj):
        print('setting LED based off socket call')


    def on_onWindCrank(self, obj):
        if obj['value']:
            print("Powering a rotor.")

if __name__ == '__main__':
    app = OGTest()
    app.main()