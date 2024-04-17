import { sheets_v4 } from '@googleapis/sheets';
import { addMilliseconds, formatISO, getHours } from 'date-fns';

import { getFile, getSheet } from '@/scripts/google/google';
import {
  doesFileExist,
  ensureDirectoryExists,
  getImagePath,
  saveArrayBufferToFile,
  writeFile,
} from '@/utils/fileHelpers';
import { Color, Show, ShowsByDate, showsToGroups } from './showlistHelpers';

const NEXT_URL = '/showlist' as const;
const FILE_URL = `./public${NEXT_URL}` as const;

type SheetParserConfig = {
  apiKey: string;
  showStartTime?: string;
  localFilePath?: string;
  fileUrlBase?: string;
};
export const parseSheetToShowList = async (
  googleSheetData: sheets_v4.Schema$ValueRange,
  parserConfig: SheetParserConfig,
): Promise<Show[]> => {
  const {
    apiKey,
    showStartTime = process.env.NEXT_PUBLIC_SHOW_START_TIME,
    localFilePath = FILE_URL,
    fileUrlBase = NEXT_URL,
  } = parserConfig;

  if (!showStartTime) {
    throw new Error('Env "NEXT_PUBLIC_SHOW_START_TIME" is missing');
  }
  const nightTimeHourStart = 22;
  const nightTimeHourEnd = 6;

  const getIsNightTime = (date: Date) => {
    const startHour = getHours(date);
    return (
      (startHour >= nightTimeHourStart && startHour <= 23) ||
      (startHour <= nightTimeHourEnd && startHour >= 0)
    );
  };

  ensureDirectoryExists(localFilePath);

  const showList = googleSheetData.values.reduce<Promise<Show[]>>(
    async (acc, sheetRow, index) => {
      if (!sheetRow || !Array.isArray(sheetRow)) {
        return acc;
      }
      const [
        _id,
        duration,
        _start,
        _end,
        producer,
        name,
        description,
        hosts,
        googleFileUrl,
        color,
      ] = sheetRow;
      // Duration can be decimal and because google sheet requires comma, make those a number
      const durationNumber = duration.includes(',')
        ? Number(duration?.replace(',', '.'))
        : duration;
      // Lookup didn't find a show
      if (!name || name === '#N/A') {
        return acc;
      }
      const shows = await acc;
      if (index > 0 && !shows[index - 1]) {
        throw new Error(
          `Failed to parse showlist sheet. Invalid data before ${JSON.stringify(
            sheetRow,
          )}`,
        );
      }

      const previousEndTime = index ? shows[index - 1].end : showStartTime;
      const startDate = new Date(previousEndTime);
      const durationMillis = durationNumber * 1000 * 60 * 60;
      const endDate = new Date(addMilliseconds(startDate, durationMillis));

      const isNight = color === Color.Night || getIsNightTime(startDate);
      const showColor = isNight
        ? Color.Night
        : color === Color.Promote || color === Color.Editorial
          ? Color.Promote
          : null;

      // Google file urls have two types:
      // from forms: https://drive.google.com/open?id=<fileId>'
      // direct file link: https://drive.google.com/file/d/<fileId>/view?usp=share_link
      // Handle both cases
      const fileId =
        googleFileUrl?.match(/.*id=(.*[^&]).*/)?.[1] ||
        googleFileUrl?.match(/.*file\/d\/(.*[^&])\/+.*/)?.[1];

      const pictureUrl = await downloadShowFile(fileId, name, {
        apiKey,
        localFilePath,
        fileUrlBase,
      });

      return shows.concat({
        name,
        start: formatISO(startDate),
        end: formatISO(endDate),
        date: formatISO(startDate),
        description,
        pictureUrl,
        hosts: hosts || null,
        producer: producer || null,
        color: showColor,
      });
    },
    Promise.resolve([]),
  );
  return showList;
};

export const saveShowlistJson = async (data: Record<string, unknown>) => {
  await writeFile(`${FILE_URL}/ohjelmakartta.json`, JSON.stringify(data));
};

export const fetchShowlist = async (): Promise<ShowsByDate> => {
  const data = await getSheet({
    apiKey: process.env.GA_API_KEY,
    spreadsheetId: process.env.GA_SPREADSHEET_SHOWLIST,
    range: process.env.GA_SPREADSHEET_RANGE,
  });
  if (!data) {
    return {};
  }
  const shows = data
    ? await parseSheetToShowList(data, { apiKey: process.env.GA_API_KEY })
    : [];

  const showsByDate = showsToGroups(shows);
  await saveShowlistJson(showsByDate);
  return showsByDate;
};

const downloadShowFile = async (
  fileId: string,
  fileTitle: string,
  parserConfig: SheetParserConfig,
): Promise<string> => {
  const { apiKey, fileUrlBase, localFilePath } = parserConfig;
  if (!fileId || !apiKey) {
    return null;
  }
  const publicFileUrl = getImagePath(fileUrlBase, fileTitle);
  if (doesFileExist(localFilePath, fileTitle)) {
    return publicFileUrl;
  }
  const result = await getFile({
    apiKey,
    fileId,
  });
  if (!result) {
    return null;
  }
  try {
    const imageArrayBuffer = result.data as ArrayBuffer; // Me just lazy...
    await saveArrayBufferToFile(imageArrayBuffer, localFilePath, fileTitle);
  } catch (error) {
    console.error(`Failed to load google file ${fileId}`);
    console.error(error);
    return null;
  }
  return publicFileUrl;
};
