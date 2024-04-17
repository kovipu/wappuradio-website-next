import type { NextApiRequest, NextApiResponse } from 'next';

import { archiveOldShowlists } from '@/archiver/archiveCrawlers';

type ResponseData = {
  message: string;
};

const isRouteEnabled = !!process.env.ENABLE_ARCHIVER_API;

/**
 * For local use only! Set `ENABLE_ARCHIVER_API` env to enable.
 * Add data to `archiveOldShowlists` function and start archiving by calling `/api/archiver` route
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (!isRouteEnabled) {
    return res.redirect('/404');
  }

  try {
    await archiveOldShowlists();
    res.status(200).json({ message: 'OK' });
  } catch (err) {
    console.debug(err);
    res.status(500).json({ message: err?.message });
  }
}
