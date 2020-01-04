import {IFieldControlPacket} from "@the-orange-alliance/lib-ems";

const RED_LED_TOP = 3;
const RED_LED_BOT = 2;

const BLUE_LED_TOP = 1;
const BLUE_LED_BOT = 0;

const PRESTART_COLOR = 1965;
const COMMIT_COLOR = 1885;
const RESET_COLOR = 1995;
const ABORT_COLOR = 1825;
const RED_START_COLOR = 1805;
const BLUE_START_COLOR = 1935;

const RED_SCORE_TOP_COLOR = 1575;
// const RED_SCORE_BOT_COLOR = 1805;

const BLUE_SCORE_TOP_COLOR = 1675;
// const BLUE_SCORE_BOT_COLOR = 1925;

export const PACKET_PRESTART: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: PRESTART_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_BOT,
        pulsewidth: PRESTART_COLOR
      }
    },
    // BOTTOM LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: PRESTART_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_BOT,
        pulsewidth: PRESTART_COLOR
      }
    }
  ]
};

export const PACKET_START: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RED_START_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_BOT,
        pulsewidth: RED_START_COLOR
      }
    },
    // BOTTOM LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_START_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_BOT,
        pulsewidth: BLUE_START_COLOR
      }
    }
  ]
};

export const PACKET_COMMIT: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: COMMIT_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_BOT,
        pulsewidth: COMMIT_COLOR
      }
    },
    // BOTTOM LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: COMMIT_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_BOT,
        pulsewidth: COMMIT_COLOR
      }
    }
  ]
};

export const PACKET_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RESET_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_BOT,
        pulsewidth: RESET_COLOR
      }
    },
    // BOTTOM LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: RESET_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_BOT,
        pulsewidth: RESET_COLOR
      }
    }
  ]
};

export const PACKET_ABORT: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: ABORT_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_BOT,
        pulsewidth: ABORT_COLOR
      }
    },
    // BOTTOM LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: ABORT_COLOR
      }
    },
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_BOT,
        pulsewidth: ABORT_COLOR
      }
    }
  ]
};

// GAME-SPECIFIC PACKETS
export const PACKET_RED_BOT_SCORE: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RED_SCORE_TOP_COLOR
      }
    }
  ]
};

export const PACKET_RED_MID_SCORE: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RED_SCORE_TOP_COLOR
      }
    }
  ]
};

export const PACKET_RED_TOP_SCORE: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RED_SCORE_TOP_COLOR
      }
    }
  ]
};

export const PACKET_RED_TOP_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
          pulsewidth: RED_START_COLOR
      }
    }
  ]
};

export const PACKET_RED_MID_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RED_START_COLOR
      }
    }
  ]
};

export const PACKET_RED_BOT_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: RED_LED_TOP,
        pulsewidth: RED_START_COLOR
      }
    }
  ]
};

export const PACKET_BLUE_BOT_SCORE: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_SCORE_TOP_COLOR
      }
    }
  ]
};

export const PACKET_BLUE_MID_SCORE: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_SCORE_TOP_COLOR
      }
    }
  ]
};

export const PACKET_BLUE_TOP_SCORE: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_SCORE_TOP_COLOR
      }
    }
  ]
};

export const PACKET_BLUE_TOP_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_START_COLOR
      }
    }
  ]
};

export const PACKET_BLUE_MID_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_START_COLOR
      }
    }
  ]
};

export const PACKET_BLUE_BOT_RESET: IFieldControlPacket = {
  messages: [
    // TOP LED SET
    {
      hub: 0,
      function: "servo",
      parameters: {
        port: BLUE_LED_TOP,
        pulsewidth: BLUE_START_COLOR
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