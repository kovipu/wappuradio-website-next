import * as gDrive from '@googleapis/drive';
import * as gSheets from '@googleapis/sheets';
import * as auth from 'google-auth-library';

const credentials = {
  private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  client_email: process.env.GA_CLIENT_EMAIL,
};

export type GoogleConfigSheets = {
  apiKey: string;
  spreadsheetId: string;
  range: string;
};

export type GoogleConfigFiles = {
  apiKey: string;
  fileId: string;
  fields?: string[];
};

const getJwt = (googleService: 'spreadsheets' | 'drive') => {
  return new auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    [`https://www.googleapis.com/auth/${googleService}`],
  );
};

export const getSheet = async (
  config: GoogleConfigSheets,
): Promise<gSheets.sheets_v4.Schema$ValueRange | null> => {
  if (!config.apiKey) {
    return null;
  }
  const jwt = getJwt('spreadsheets');
  return getSheetRequest(
    jwt,
    config.apiKey,
    config.spreadsheetId,
    config.range,
  );
};

const getSheetRequest = async (
  jwt: auth.JWT,
  apiKey: string,
  spreadsheetId: string,
  range: string,
) => {
  const sheets = gSheets.sheets({ version: 'v4' });
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      auth: jwt,
      key: apiKey,
    });
    return result.data;
  } catch (error) {
    console.dir(error, { depth: null });
    throw error;
  }
};

export const getFile = (config: GoogleConfigFiles) => {
  const jwt = getJwt('drive');
  return getFileRequest(jwt, config.apiKey, config.fileId, config.fields);
};

export const getFileRequest = async (
  jwt: auth.JWT,
  apiKey: string,
  fileId: string,
  fields?: string[],
) => {
  const drive = gDrive.drive({
    version: 'v3',
    auth: jwt,
    key: apiKey,
  });
  try {
    // List of file fields https://developers.google.com/drive/api/v3/reference/files
    const fieldString = fields?.join(',') || null;
    const result = await drive.files.get(
      {
        fileId,
        fields: fieldString,
        alt: 'media',
      },
      {
        responseType: 'arraybuffer',
      },
    );

    if (result.status === 404) {
      console.warn('File not found', fileId);
      return null;
    } else if (result.status !== 200) {
      throw new Error(`Failed to load file ${fileId}`);
    }
    return result;
  } catch (error) {
    console.dir(error, { depth: null });
    throw error;
  }
};
