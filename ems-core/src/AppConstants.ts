import {IFieldControlPacket} from "@the-orange-alliance/lib-ems";

export const PACKET_BALL_DUMP: IFieldControlPacket = {
  messages: [
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 2,
        setpoint: 0
      }
    },
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 3,
        setpoint: 0
      }
    }
  ]
};

export const PACKET_BALL_RESET: IFieldControlPacket = {
  messages: [
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 2,
        setpoint: 32000
      }
    },
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 3,
        setpoint: 32000
      }
    }
  ]
};

// export const PACKET_FIELD_RESET: IFieldControlPacket = {

// };