import { FC, useState, useEffect } from 'react';
import { startOfDay, format, parseISO } from 'date-fns';
import fi from 'date-fns/locale/fi';

// Fetch next events but not more than 6 months from now
const EVENT_COUNT = 3;
const MONTHS_COUNT = 6;
const dateMax = new Date();
dateMax.setMonth(new Date().getMonth() + MONTHS_COUNT);
const TIME_MIN = startOfDay(new Date()).toISOString();
const TIME_MAX = dateMax.toISOString();

const eventsUrl = `https://content.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID}/events?alwaysIncludeEmail=false&maxResults=${EVENT_COUNT}&timeMin=${TIME_MIN}&timeMax=${TIME_MAX}&showDeleted=false&showHiddenInvitations=false&singleEvents=true&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}&orderBy=startTime`;

interface EventWithDate {
  start: { date: string };
  end: { date: string };
  summary: string;
  location: string;
}

interface EventWithDatetime {
  start: { dateTime: string };
  end: { dateTime: string };
  summary: string;
  location: string;
}

type Event = EventWithDate | EventWithDatetime;

const Calendar: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    fetch(eventsUrl)
      .then((res) => res.json())
      .then((json) => setEvents(json.items))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col max-w-full m-4 w-128 md:m-8">
      <h2 className="text-xl font-bold text-center text-white">
        Tulevat tapahtumat
      </h2>
      {events.map((event, idx) => (
        <Event key={idx} event={event} />
      ))}
      <a
        className="ml-auto font-bold underline transition text-teal hover:text-coral"
        href={
          process.env.NEXT_PUBLIC_NEXT_PUBLIC_GOOGLE_CALENDAR_SHARE_URL || ''
        }
        target="_blank" rel="noreferrer"
      >
        Tilaa kalenteri
      </a>
    </div>
  );
};

const Event: FC<{ event: Event }> = ({ event }) => {
  const start =
    'dateTime' in event.start
      ? parseISO(event.start.dateTime)
      : parseISO(event.start.date);
  const end =
    'dateTime' in event.end
      ? parseISO(event.end.dateTime)
      : parseISO(event.end.date);

  const dateFormatted = format(start, 'd.M.', { locale: fi });
  const weekday = format(start, 'eee', { locale: fi }).slice(0, 2);

  const timeFormatted =
    'dateTime' in event.start
      ? formatWithTime(start, end)
      : formatWithoutTime(start, end);

  return (
    <div className="flex flex-row p-2 my-2 text-white bg-blue-darkest">
      <div className="flex flex-col items-center justify-center p-2 w-28">
        <div className="text-3xl font-bold">{dateFormatted}</div>
        <div className="text-lg font-bold">{weekday}</div>
      </div>
      <div className="w-full p-2">
        <h3 className="text-xl font-bold text-coral">{event.summary}</h3>
        <div>{timeFormatted}</div>
        <div>@ {event.location}</div>
      </div>
    </div>
  );
};

const formatWithTime = (start: Date, end: Date) => {
  const startFormatted = format(start, 'HH:mm', { locale: fi });
  const endFormatted = format(end, 'HH:mm', { locale: fi });
  return `kello ${startFormatted} - ${endFormatted}`;
};

const formatWithoutTime = (start: Date, end: Date) => {
  const startFormatted = format(start, 'd.M.', { locale: fi });
  const endFormatted = format(end, 'd.M.', { locale: fi });
  return `${startFormatted} - ${endFormatted}`;
};

export default Calendar;
