import { createRef, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';

import PlayerControlPanel from 'components/playerControlPanel';
import { ShoutBoxAndVideoProvider } from 'hooks/useShoutboxAndVideo';
import { ChatWrapper } from 'components/ShoutBox/shoutbox';
import VideoPlayer from 'components/videoPlayer';

const AUDIO_STREAM_URL = 'https://player.turunwappuradio.com/wappuradio.mp3';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const audioEl = createRef<HTMLAudioElement>();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playClicked, setPlayClicked] = useState(false);

  const [playerMounted, setPlayerMounted] = useState(true);

  const handleEnded = () => {
    // remount the audio element to reset the audio stream
    setPlayerMounted(false);
  };

  useEffect(() => {
    audioEl?.current?.addEventListener('ended', handleEnded);
    return () => audioEl?.current?.removeEventListener('ended', handleEnded);
  }, [audioEl]);

  useEffect(() => {
    if (!playerMounted) {
      setPlayerMounted(true);
    }
    if (playerMounted && playing) {
      audioEl?.current?.play();
      setPlaying(true);
    }
  }, [playerMounted]);

  const handlePlayPause = () => {
    setPlayClicked(true);

    if (audioEl.current.paused) audioEl.current.play();
    else {
      // Pause, but then load the stream again ready to start
      audioEl.current.pause();
      audioEl.current.src = AUDIO_STREAM_URL;
    }
    setPlaying(!playing);
  };

  const handleMute = () => {
    setMuted(!muted);
    audioEl.current.muted = !audioEl.current.muted;
  };

  return (
    <ShoutBoxAndVideoProvider>
      {playerMounted && (
        <audio ref={audioEl}>
          <source src={AUDIO_STREAM_URL} type="audio/mpeg" />
        </audio>
      )}
      <Component
        {...pageProps}
        playing={playing}
        onPlayPause={handlePlayPause}
        muted={muted}
        onMute={handleMute}
      />
      <div className="fixed bottom-0 z-50 w-full">
        <div className="flex w-full flex-col justify-center bg-blue-darkest md:flex-row">
          <VideoPlayer />
          <ChatWrapper />
        </div>

        {playClicked && (
          <PlayerControlPanel
            playing={playing}
            onPlayPause={handlePlayPause}
            muted={muted}
            onMute={handleMute}
          />
        )}
      </div>
    </ShoutBoxAndVideoProvider>
  );
};

export default MyApp;
