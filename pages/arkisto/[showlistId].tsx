import { BsArrowLeft } from 'react-icons/bs';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { fetchArchivedShowlist } from '@/archiver/archive';
import Hero from '@/components/hero';
import { Showlist } from '@/components/showlist';
import {
  fetchContent,
  fetchNavigationItems,
  NavigationItem,
} from '@/contentful/client';
import {
  ShowlistPageDocument,
  ShowlistPageQuery,
} from '@/contentful/graphql/showlistPage.graphql';
import { ShowlistPathsDocument } from '@/contentful/graphql/showlistPaths.graphql';
import { ShowlistPathsQuery } from '@/contentful/graphql/showlistPaths.graphql';
import { Show } from '@/scripts/google/showlistHelpers';

interface ShowListPageProps {
  name: string;
  id: string;
  navigationItems: NavigationItem[];
  showsByDate: {
    [key: string]: Show[];
  };
  heroImage: {
    url?: string;
  };
  heroSubtext: string;
}

export const ShowListPage: NextPage<ShowListPageProps> = ({
  name,
  showsByDate,
  heroImage,
  navigationItems,
  heroSubtext,
}) => {
  const title = `${name} | Turun Wappuradio`;

  return (
    <div className="min-h-screen w-full">
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={heroSubtext} />
        <meta name="og:description" content={heroSubtext} />
        <meta name="twitter:description" content={heroSubtext} />
      </Head>
      <Hero
        title={name}
        image={heroImage}
        navigationItems={navigationItems}
        subtext={heroSubtext}
        isCompact={true}
      />
      <div className="mx-auto flex max-w-6xl flex-col py-6">
        <Link
          href="/arkisto"
          className="my-6 ml-28 mr-auto flex font-bold text-teal transition hover:text-coral"
        >
          <BsArrowLeft className="mr-2 h-6 w-6" />
          Kaikki ohjelmakartat
        </Link>
      </div>
      <Showlist showsByDate={showsByDate} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pathsResult = await fetchContent<ShowlistPathsQuery>(
    ShowlistPathsDocument,
  );
  const paths = pathsResult.programmeCollection.items.map((item) => ({
    params: {
      showlistId: item.id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { showlistId } = context.params;

  const currentShowlistId = Array.isArray(showlistId)
    ? showlistId[0]
    : showlistId;

  const data = await fetchContent<ShowlistPageQuery>(ShowlistPageDocument, {
    showlistId: currentShowlistId,
  });

  const { name, id, heroImage, heroSubtext } =
    data.programmeCollection.items[0];

  const showsByDate = await fetchArchivedShowlist(currentShowlistId);

  const navigationItems = await fetchNavigationItems();

  return {
    props: {
      name,
      id,
      showsByDate,
      navigationItems,
      heroImage,
      heroSubtext,
    },
  };
};

export default ShowListPage;
