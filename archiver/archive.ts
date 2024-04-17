import {
  Show,
  ShowsByDate,
  showsToGroups,
} from '@/scripts/google/showlistHelpers';

const showlistBaseUrl = process.env.ARCHIVE_SOURCE_URL;
const emptyResponse = {} as const;

interface LegacyShowList {
  showsByDate: ShowsByDate;
  weekKeys: Record<string, string[]>;
}

/**
 * Archive S3 bucket API
 */
export const fetchArchivedShowlist = async (
  showlistId: string,
): Promise<ShowsByDate> => {
  if (!showlistBaseUrl) {
    console.error('Arkiston polkua ei ole määritetty');
    return emptyResponse;
  }
  const url = `${showlistBaseUrl}${showlistId}/showlist.json`;

  try {
    const response = await fetch(url);
    const showlist: Show[] | LegacyShowList = await response.json();

    if (Array.isArray(showlist)) {
      return showsToGroups(showlist);
    }
    if (showlist?.showsByDate) {
      return showlist.showsByDate;
    }
    return emptyResponse;
  } catch (error) {
    console.error(error);
    console.error('Ohjelmakartan nouto epäonnistui');
  }
  return emptyResponse;
};
