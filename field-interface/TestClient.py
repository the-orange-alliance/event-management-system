from socketio_client.manager import Manager

import gevent
from gevent import monkey;
monkey.patch_socket()

io = Manager('http', '192.168.1.214', 8081)
chat = io.socket('/')

@chat.on_connect()
def chat_connect():
    print('[Connected]')

# @chat.on('reconnect')
# def chat_reconnect():
#     print('[Reconnected]')
#
# @chat.on('disconnect')
# def chat_disconnect():
#     print('[Disconnected]')
#
# @chat.on('onMatchPrestart')
# def chat_onPrestart(fieldNum):
#     print('prestart, field ' + str(fieldNum['fieldNum']))
#
# @chat.on('onMatchAbort')
# def chat_onMatchAbort():
#     print("Match Aborted.")
#
# @chat.on('onMatchEnd')
# def chat_onMatchEnd():
#     print("Match Ended.")
#
# @chat.on('setLED')
# def chat_setLED():
#     print('setting LED based off socket call')
#
# @chat.on('onWindCrank')
# def chat_onWindCrank():
#     print("wind")


io.connect()
gevent.wait()