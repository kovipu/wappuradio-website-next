import fs from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

export const ensureDirectoryExists = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

export const getImagePath = (path: string, basename: string, ext?: string) => {
  const sanitized = basename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${sanitized}${ext || '.jpg'}`;
  return join(path, filename);
};

export const doesFileExist = (path: string, basename: string) => {
  const newFilePath = getImagePath(path, basename);
  return fs.existsSync(newFilePath);
};

export const saveArrayBufferToFile = async (
  data: ArrayBuffer,
  path: string,
  basename: string,
) => {
  const newFilePath = getImagePath(path, basename);
  try {
    await sharp(data).resize(900).jpeg().toFile(newFilePath);
  } catch (error) {
    console.error(`Failed to resize file ${basename}`);
    console.error(error);
  }
};

const downloadFile = async (url: string, path: string, filename: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  const extension = parse(filename).ext;
  const newFilename = filename.replace(extension, '.jpeg');
  const newFilePath = join(path, newFilename);
  if (fs.existsSync(newFilePath)) {
    return newFilename;
  }
  const response = await fetch(url);

  if (!response.ok) {
    const responseText = await response.text();
    console.error(responseText);
    console.error(response.statusText);
    throw new Error('Failed to download drive file');
  }

  const buffer = await response.arrayBuffer();

  try {
    await sharp(buffer).resize(900).jpeg().toFile(newFilePath);
  } catch (error) {}
  return newFilename;
};
export default downloadFile;

export const writeFile = (path: string, data: string) =>
  fs.writeFileSync(path, data, 'utf-8');
