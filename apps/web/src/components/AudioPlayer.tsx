import React, { useRef, useEffect } from "react";

interface AudioPlayerProps {
  soundFile: string;
  play: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ soundFile, play }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play the sound when the 'play' prop changes to true
  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play();
    }
  }, [play]);

  return <audio ref={audioRef} src={soundFile} />;
};

export default AudioPlayer;
