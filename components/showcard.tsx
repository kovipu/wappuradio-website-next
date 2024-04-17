import { useState } from 'react';
import { format } from 'date-fns';
import fi from 'date-fns/locale/fi';
import Image from 'next/legacy/image';

import { Show } from '@/scripts/google/showlistHelpers';
import placeholderImage from '../public/kuva_puuttuu_v2.jpeg';

interface ShowCard {
  show: Show;
  index: number;
  className?: string;
  forceOpen?: boolean;
}

export const ShowCard = ({ show, index, className, forceOpen }: ShowCard) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(forceOpen ?? false);

  const handleClick = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`flex w-full rounded ${className} ${
        isExpanded
          ? 'h-auto rounded-l-none rounded-t lg:rounded-l lg:rounded-t-none'
          : 'h-40'
      }`}
    >
      <Time start={show.start} end={show.end} />
      <button
        className={`group relative flex h-full w-full flex-col-reverse overflow-hidden rounded md:flex-row  ${
          isExpanded
            ? 'flex rounded md:contents'
            : 'bg-gradient-to-bl from-transparent via-transparent to-blue-darkest'
        }`}
        onClick={handleClick}
      >
        <TitleInfo show={show} isExpanded={isExpanded} index={index} />
        <Descriptions show={show} isExpanded={isExpanded} />
        <ShowImage show={show} isExpanded={isExpanded} />
      </button>
    </div>
  );
};

interface TimeProps {
  start: string;
  end: string;
}

const Time = ({ start, end }: TimeProps) => {
  const startTime = format(new Date(start), 'p', { locale: fi });
  const endTime = format(new Date(end), 'p', { locale: fi });

  return (
    <p className="mt-1 h-[25px] w-[25px] rotate-90 font-bold text-white">
      {startTime}&nbsp;-&nbsp;{endTime}
    </p>
  );
};

interface TitleInfoProps {
  show: Show;
  isExpanded: boolean;
  index: number;
}

const TitleInfo = ({ show, isExpanded, index }: TitleInfoProps) => {
  return (
    <div
      className={`absolute bottom-1 z-20 max-w-full flex-col px-2 text-left text-white
           ${isExpanded ? 'hidden' : 'block'}`}
    >
      <p
        className={`w-fit rounded-sm px-2 text-base font-bold md:text-lg ${
          index % 2 === 0 ? 'bg-coral' : 'bg-teal'
        }`}
      >
        {show.name}
      </p>
      <p className="mt-2 px-2 text-sm">
        Juontaa: {show.hosts ?? 'Haamujuontaja'}
      </p>
    </div>
  );
};

interface DescriptionsProps {
  show: Show;
  isExpanded: boolean;
}

const Descriptions = ({ show, isExpanded }: DescriptionsProps) => {
  return (
    <div
      className={`z-10 mt-auto flex flex-col overflow-y-auto rounded bg-blue-dark p-4 text-left transition ease-in-out md:ml-auto md:mt-0 md:h-[20rem] xl:h-[25rem] ${
        isExpanded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-base font-bold text-teal sm:text-lg">{show.name}</h2>
      <h3 className="mt-2 text-sm font-bold text-white sm:text-base">
        Juontaa: {show.hosts ?? 'Haamujuontaja'}
      </h3>
      <h3 className="mt-1 text-sm font-bold text-white sm:text-base">
        Tuottaa: {show.producer ?? 'Toimitus'}
      </h3>
      <p className="mt-2 text-sm text-white md:text-base">{show.description}</p>
    </div>
  );
};

interface ShowImageProps {
  show: Show;
  isExpanded: boolean;
}

const ShowImage = ({ show, isExpanded }: ShowImageProps) => {
  const { pictureUrl, name } = show;
  const url = pictureUrl || placeholderImage;

  return (
    <div
      className={
        isExpanded
          ? 'relative aspect-[3/2] h-full w-full flex-none md:h-[20rem] md:w-[30rem] xl:h-[25rem] xl:w-[37.5rem]'
          : ''
      }
    >
      <Image
        src={url}
        unoptimized
        layout={'fill'}
        objectFit="cover"
        objectPosition={'65% 35%'}
        className={`-z-10  ${
          isExpanded
            ? 'rounded-t md:rounded-b md:rounded-l md:rounded-l-none '
            : 'opacity-70 transition duration-300 ease-in-out md:group-hover:scale-110 md:group-hover:opacity-100'
        }`}
        alt={name || ''}
      />
    </div>
  );
};

export default ShowCard;
