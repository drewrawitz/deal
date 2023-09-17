import { SoundTriggers } from "@deal/types";

export const soundFileMapping: Record<SoundTriggers, string> = {
  [SoundTriggers.ENTER_ROOM]: "/sounds/room-enter.wav",
  [SoundTriggers.LEAVE_ROOM]: "/sounds/room-leave.wav",
  [SoundTriggers.START_GAME]: "/sounds/room-enter.wav",
};
