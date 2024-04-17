import { useState } from 'react';
import { differenceInMinutes, format, parse } from 'date-fns';
import fi from 'date-fns/locale/fi';
import { append, head, keys, last } from 'ramda';

import { Show, ShowsByDate } from '@/scripts/google/showlistHelpers';
import { ModeButton } from './button';
import { ShowCard } from './showcard';
import { WideScreencard } from './widescreen-card';

const GROUP_SIZE = 5;

interface ShowlistMapProps {
  showsByDate: ShowsByDate;
}

export const ShowlistMap = ({ showsByDate }: ShowlistMapProps) => {
  // Take every n consecutive days.
  const groups: string[][] = keys(showsByDate).reduce((acc, date, idx) => {
    const groupIdx = Math.floor(idx / GROUP_SIZE);
    acc[groupIdx] = append(date, acc[groupIdx] ?? []);
    return acc;
  }, []);

  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [openGroup, setOpenGroup] = useState(0);

  const openWeekDays = groups[openGroup];

  const formatGroupButtonText = (group: string[]): string => {
    if (group.length === 1) return formatDayKey(head(group));

    const startDay = formatDayKey(head(group), 'EEEEEE dd.');
    const endDay = formatDayKey(last(group));
    return `${startDay} – ${endDay}`;
  };

  // prettier-ignore
  const timeStamps: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

  return (
    <div className="mb-4 flex flex-col pt-6">
      {selectedShow && (
        <ShowCard
          show={selectedShow}
          index={0}
          className="mx-auto mt-4 max-w-[60rem]"
          forceOpen={true}
        />
      )}
      {groups.length > 1 ? (
        <div className="flex space-x-2 p-6">
          {groups.map((group, idx) => (
            <ModeButton
              key={head(group)}
              text={formatGroupButtonText(group)}
              onClick={() => setOpenGroup(idx)}
              isActive={openGroup === idx}
            />
          ))}
        </div>
      ) : null}
      <div className="flex">
        <div className="-mt-3 p-6">
          {timeStamps.map((timeStamp, i) => (
            <p className="h-[60px] font-bold text-white" key={i}>
              {timeStamp}
            </p>
          ))}
        </div>
        <div className="flex w-full">
          {openWeekDays.map((day, i) => {
            return (
              <div
                key={i}
                className="flex w-full max-w-[1/7] flex-col text-center"
              >
                <p className="mx-auto w-full font-bold text-white">
                  {formatDayKey(day)}
                </p>

                {/* If the first show of the day does not start at midnight, add buffer */}
                {showsByDate[day] && (
                  <Buffer firstShow={showsByDate[day][0]} day={day} />
                )}

                {showsByDate[day]?.map((show: Show, i) => {
                  return (
                    <WideScreencard
                      onClick={() => setSelectedShow(show)}
                      key={i}
                      showLength={differenceInMinutes(
                        new Date(show.end),
                        new Date(show.start),
                      )}
                      text={show?.name}
                      color={show?.color}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const formatDayKey = (day: string, format_: string = 'EEEEEE dd.M.'): string =>
  format(parse(day, 'y.M.dd', new Date()), format_, {
    locale: fi,
  });

// If the first show of the day does not start at midnight, add buffer
const Buffer = ({ firstShow, day }: { firstShow: Show; day: string }) => {
  const dayParsed = parse(day, 'y.M.dd', new Date());
  const startTime = new Date(firstShow.start);
  const diff = differenceInMinutes(startTime, dayParsed);

  if (diff == 0) {
    return null;
  }

  return <div style={{ height: `${diff}px` }} />;
};

export default ShowlistMap;
