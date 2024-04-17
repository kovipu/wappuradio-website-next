import { Dispatch, SetStateAction, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { format, parse } from 'date-fns';
import fi from 'date-fns/locale/fi';

import { ShowCard } from '@/components/showcard';
import { Show } from '@/scripts/google/showlistHelpers';

interface NavButton {
  value: string | null;
  onClick: (date: string) => void;
  text: string;
  alternate?: boolean;
}

const NavButton = ({ value, onClick, text, alternate = false }: NavButton) => {
  const disabled = !value;
  return (
    <>
      <a
        className={`${'flex cursor-pointer py-8 font-bold text-teal transition hover:text-coral'}
        ${disabled ? 'hidden' : ''}
        ${alternate ? '' : ''}
        `}
        onClick={() => onClick(value)}
      >
        {alternate && <BsArrowLeft className="mr-2 h-6 w-6" />}
        {text}
        {!alternate && <BsArrowRight className="ml-2 h-6 w-6" />}
      </a>
    </>
  );
};

interface DateButton {
  value: string;
  currentDate: string;
  onClick: Dispatch<SetStateAction<string>>;
}
const DateButton = ({ value, currentDate, onClick }: DateButton) => {
  const dateParsed = parse(value, 'y.M.dd', new Date());
  const str = format(dateParsed, 'cccc d.M.', { locale: fi });

  return (
    <button
      className={`w-full rounded-sm p-2 text-left capitalize text-white ${
        value === currentDate
          ? 'bg-coral font-bold'
          : 'bg-blue-darkest hover:text-coral'
      }`}
      onClick={() => onClick(value)}
    >
      {str}
    </button>
  );
};

interface ResponsiveShowlistProps {
  showsByDate: {
    [key: string]: Show[];
  };
}

export const ResponsiveShowlist = ({
  showsByDate,
}: ResponsiveShowlistProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    Object.keys(showsByDate).includes(format(new Date(), 'y.M.dd'))
      ? format(new Date(), 'y.M.dd')
      : Object.keys(showsByDate)[0],
  );

  const setDateAndScroll = (date: string) => {
    setSelectedDate(date);
    const element = document.getElementById('showList');
    element.scrollIntoView(true);
  };

  const dates = Object.keys(showsByDate).map((date) => date);
  const getNextDate =
    dates.indexOf(selectedDate) < dates.length - 1
      ? dates[dates.indexOf(selectedDate) + 1]
      : null;
  const getPreviousDate =
    dates.indexOf(selectedDate) <= dates.length - 1
      ? dates[dates.indexOf(selectedDate) - 1]
      : null;
  return (
    <>
      <div
        className="flex w-full max-w-7xl flex-col pt-6 lg:flex-row"
        id="showList"
      >
        <select
          className="mb-4 ml-6 flex h-8 rounded-sm  bg-blue-dark px-2 font-bold text-coral lg:hidden"
          onChange={(event) => setSelectedDate(event.target.value)}
          value={selectedDate}
        >
          {Object.keys(showsByDate).map((date, i) => {
            const dateParsed = parse(date, 'y.M.dd', new Date());

            const str = format(dateParsed, 'cccc d.M', { locale: fi });
            const text = str.charAt(0).toUpperCase() + str.slice(1);
            return (
              <option key={date + i} value={date}>
                {text}
              </option>
            );
          })}
        </select>

        <div className="mr-auto w-full space-y-4 lg:ml-[10rem]">
          {showsByDate[selectedDate]?.map((show, i) => (
            <ShowCard show={show} key={show.start + i} index={i} />
          ))}
        </div>
        <div className="ml-4 hidden w-[10rem] shrink-0 flex-col space-y-2 lg:flex">
          {Object.keys(showsByDate).map((date) => (
            <DateButton
              key={date}
              value={date}
              currentDate={selectedDate}
              onClick={(date) => setSelectedDate(date)}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-2 flex w-full max-w-6xl justify-center md:justify-end md:pr-32">
        <div className={`${getNextDate ? 'mr-6' : ''}`}>
          <NavButton
            text="Edellinen päivä"
            value={getPreviousDate}
            onClick={(date) => setDateAndScroll(date)}
            alternate
          />
        </div>
        <NavButton
          text="Seuraava päivä"
          value={getNextDate}
          onClick={(date) => setDateAndScroll(date)}
        />
      </div>
    </>
  );
};

export default ResponsiveShowlist;
