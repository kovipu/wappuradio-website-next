import React from 'react';
import Image from 'next/legacy/image';
import { format } from 'date-fns';

interface NameFormatterProps {
  name: string;
  timestamp?: number;
  telegram?: boolean;
}

const NameFormatter = ({ name, timestamp, telegram }: NameFormatterProps) => {
  const time = timestamp ? format(new Date(timestamp), 'HH:mm') : null;

  return (
    <div
      className={`flex items-center pr-2 text-sm font-bold ${findStyle(name)}`}
    >
      {name}
      {telegram ? (
        <div className="relative ml-2 h-3.5 w-3.5">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://t.me/turunwappuradio"
          >
            <Image
              layout="fill"
              unoptimized={true}
              alt="Telegram"
              src="/telegram.svg"
            ></Image>
          </a>
        </div>
      ) : null}
      {time ? (
        <span className="pl-2 text-xs font-normal opacity-70"> {time}</span>
      ) : null}
    </div>
  );
};

const findStyle = (name: string) => {
  switch (name) {
    case 'Toimitus':
      return 'text-coral';
    case 'Palvelin':
      return 'text-coral';
    default:
      return 'text-white';
  }
};

export default NameFormatter;
