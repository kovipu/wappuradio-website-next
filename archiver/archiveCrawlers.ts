import { mkdirSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { parseSheetToShowList } from '@/scripts/google/client';
import { getSheet, GoogleConfigSheets } from '@/scripts/google/google';

export const archiveOldShowlists = async () => {
  // NOTE: Uncomment for archiving google sheet data
  // const sheetConfigs = [
  //   { name: '2023-wappu', showStartTime: '2023-04-20T12:00:00', config: { apiKey: process.env.GA_API_KEY, spreadsheetId: '1eHDK-MYm6B3BH8rewQr04-pd2IK4iFwsPY5HKkrVNJg', range: 'Ohjelmakartta!A3:J5' } },
  //   { name: '2023-syssy', showStartTime: '2023-04-20T12:00:00', config: { apiKey: process.env.GA_API_KEY, spreadsheetId: '18UqWSStevUGa_rdIi9zF6NuCzbZc7H1ZnVMaIObV_Cg', range: 'Ohjelmakartta!A3:J32' } }
  // ];
  // for(const { config, name, showStartTime } of sheetConfigs) {
  //   await archiveGogleSheet(config, name, showStartTime);
  // }
};

/** Helpers */

const getArchivePath = (showlistDir: string) =>
  path.join('.', 'stuff', 'archives', showlistDir);

const mkdirp = async (filePath: string) => {
  try {
    // Ensure dirs exists with mkdir
    mkdirSync(filePath, { recursive: true });
  } catch (error) {
    // noop. Throws error if dirs exists
  }
};

const archiveJson = async (archivePath: string, showlistData: {}) => {
  const archiveFilePath = path.join(archivePath, `showlist.json`);
  await fs.writeFile(archiveFilePath, JSON.stringify(showlistData), 'utf-8');
};

/** Contentful - Pre wappu 2023 */
const ARCHIVE_SOURCE_URL = process.env.ARCHIVE_SOURCE_URL || '';

/** Google Sheets - Post wappu 2023 */

const archiveGogleSheet = async (
  config: GoogleConfigSheets,
  name: string,
  showStartTime: string,
) => {
  const archivePath = getArchivePath(name);
  const pictureFolder = path.join(archivePath, 'pictures');
  mkdirp(archivePath);
  mkdirp(pictureFolder);

  const showlistResponse = await getSheet(config);
  const showlist = await parseSheetToShowList(showlistResponse, {
    apiKey: process.env.GA_API_KEY,
    fileUrlBase: path.join(ARCHIVE_SOURCE_URL, name, 'pictures'),
    localFilePath: pictureFolder,
    showStartTime,
  });
  await archiveJson(archivePath, showlist);
};
