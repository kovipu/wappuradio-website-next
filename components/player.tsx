import Image from 'next/legacy/image';
import { useEffect, useState } from 'react';
import { FiMessageSquare, FiPause, FiPlay, FiVideo } from 'react-icons/fi';
import { format } from 'date-fns';

import useShoutBoxAndVideo from '@/hooks/useShoutboxAndVideo';
import { Show } from '@/scripts/google/showlistHelpers';
import placeholderImage from '../public/kuva_puuttuu_v2.jpeg';
import testcard from '../public/testcard.webp';

const SHOW_REFRESH_TIME = 10000; // 10 seconds

interface PlayerProps {
  playing: boolean;
  onPlayPause: () => void;
  muted: boolean;
  onMute: () => void;
  showsByDate: Record<string, Show[]>;
}

const Player = ({ playing, onPlayPause, showsByDate }: PlayerProps) => {
  const show = useCurrentShow(showsByDate);

  const { shoutboxOpen, setShoutboxOpen, videoOpen, setVideoOpen } =
    useShoutBoxAndVideo();

  const handleShoutboxToggle = () => {
    setShoutboxOpen(!shoutboxOpen);
  };

  const handleVideoToggle = () => {
    setVideoOpen(!videoOpen);
  };

  const { pictureUrl, name, hosts } = show ?? {};
  const url = name ? pictureUrl ?? placeholderImage : testcard;
  return (
    <div className="flex justify-center p-6">
      <div className="flex w-[21rem] max-w-[59rem] flex-wrap items-center rounded bg-blue-darkest md:w-full md:flex-nowrap md:justify-start">
        <div className="rounded bg-gradient-to-t from-coral via-blue-lightest to-teal p-1.5">
          <div className="relative aspect-[3/2] w-80 rounded md:w-[28rem] lg:w-128">
            <Image
              src={url}
              objectFit="cover"
              unoptimized={true} // next.config.js has `loader:'custom'` therefore Image component expects loader-prop. Show images 2023 are optimized on built time.
              layout="fill"
              alt=""
            />
          </div>
        </div>
        <div className="mx-6 flex flex-col justify-between py-4 text-white md:mx-10 md:h-full md:py-10">
          {name && (
            <div className="mb-4 flex flex-col">
              <span className="text-teal">Ohjelmassa nyt</span>
              <span className="text-lg font-bold">{name}</span>
              <span className="opacity-80">
                Juontaa: {hosts ?? 'Haamujuontaja'}
              </span>
            </div>
          )}

          <div className="flex w-full flex-wrap items-center gap-4">
            <button
              onClick={onPlayPause}
              title="Play/Pause"
              className={`flex h-20 w-20 items-center justify-center rounded-full ${
                playing ? 'bg-teal' : 'bg-coral'
              }`}
            >
              {playing ? <FiPause size="3rem" /> : <FiPlay size="3rem" />}
            </button>

            <div className={`flex items-center gap-4`}>
              <button
                onClick={handleShoutboxToggle}
                title="chat"
                className={`h-12 w-12 rounded-full ${
                  shoutboxOpen ? 'bg-teal' : 'bg-coral'
                }`}
              >
                <FiMessageSquare size="1.7rem" className="mx-auto" />
              </button>
              <button
                onClick={handleVideoToggle}
                title="Webcam"
                className={`h-12 w-12 rounded-full ${
                  videoOpen ? 'bg-teal' : 'bg-coral'
                }`}
              >
                <FiVideo size="1.7rem" className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useCurrentShow = (showsByDate?: Record<string, Show[]>) => {
  const [currentShow, setCurrentShow] = useState<Show | null>(null);

  useEffect(() => {
    const getCurrentShow = () => {
      const now = new Date();
      const currentDate = format(now, 'y.M.dd');
      const todaysShows = showsByDate?.[currentDate];

      if (!todaysShows) {
        setCurrentShow(null);
        return;
      }

      const currentShow: Show | null = todaysShows.find((show) => {
        const startTime = new Date(show.start);
        const endTime = new Date(show.end);

        return now >= startTime && now <= endTime;
      });

      setCurrentShow(currentShow);
    };

    getCurrentShow();
    const updater = setInterval(getCurrentShow, SHOW_REFRESH_TIME);
    return () => clearInterval(updater);
  }, [showsByDate]);

  return currentShow;
};

export default Player;
