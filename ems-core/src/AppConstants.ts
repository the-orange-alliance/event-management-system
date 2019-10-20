import {IFieldControlPacket} from "@the-orange-alliance/lib-ems";

export const PACKET_BALL_DUMP: IFieldControlPacket = {
  messages: [
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 0,
        pulsewidth: 0
      }
    },
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 1,
        pulsewidth: 0
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
        port: 0,
        pulsewidth: 32000
      }
    },
    {
      hub: 0,
      function: "motor",
      parameters: {
        port: 1,
        pulsewidth: 32000
      }
    }
  ]
};

// export const PACKET_FIELD_RESET: IFieldControlPacket = {

// };