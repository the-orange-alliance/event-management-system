import {IFieldControlPacket} from "@the-orange-alliance/lib-ems";

export const PACKET_BALL_DUMP: IFieldControlPacket = {
  messages: [
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: 0,
        setpoint: 32000
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: 1,
        setpoint: 32000
      }
    }
  ]
};

//export const PACKET_FIELD_RESET: IFieldControlPacket = {

//};