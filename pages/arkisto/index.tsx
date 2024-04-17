import { BsArrowRight } from 'react-icons/bs';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/legacy/image';
import Link from 'next/link';

import Footer from '@/components/footer';
import Hero from '@/components/hero';
import {
  fetchContent,
  fetchNavigationItems,
  NavigationItem,
} from '@/contentful/client';
import { contentfulImageLoader } from '@/contentful/contentfulImageLoader';
import {
  ArchivePageDocument,
  ArchivePageQuery,
} from '@/contentful/graphql/archivePage.graphql';

interface ShowList {
  id?: string;
  name?: string;
  shortDescription?: string;
  showOrder?: number;
  coverImage?: {
    url?: string;
  };
}

interface ArchivePageProps {
  navigationItems: NavigationItem[];
  showLists: ShowList[];
}

const ArchivePage: NextPage<ArchivePageProps> = ({
  navigationItems,
  showLists,
}) => {
  return (
    <div className="min-h-screen w-full">
      <Head>
        <title>Turun Wappuradion arkisto</title>
        <meta
          name="description"
          content="Kokoelma Turun Wappuradion ohjelmakarttoja kautta aikain."
        />
      </Head>
      <Hero
        title="Arkisto"
        subtext="Kokoelma Turun Wappuradion ohjelmakarttoja"
        navigationItems={navigationItems}
        isCompact={true}
      />
      <article className="mx-auto max-w-4xl px-4 pb-20 pt-12 text-white">
        <h1 className="my-4 text-3xl font-bold text-coral">
          Menneet lähetykset
        </h1>

        {showLists.map((showList) => (
          <ShowListCard showList={showList} key={showList.id} />
        ))}
      </article>
      <Footer navigationItems={navigationItems} />
    </div>
  );
};

const ShowListCard = ({ showList }: { showList: ShowList }) => {
  const { id, coverImage, name, shortDescription } = showList;

  return (
    <Link
      href={`/arkisto/${id}`}
      className="group my-4 flex flex-col overflow-hidden rounded bg-blue-dark transition hover:scale-[1.03] md:flex-row"
    >
      <div className="relative inline h-40 w-full max-w-full shrink-0 grow-0 md:h-48 md:w-64">
        <Image
          src={coverImage.url}
          alt=""
          loader={contentfulImageLoader}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col p-4 md:p-6">
        <h2 className="mb-2 text-xl font-bold text-coral">{name}</h2>
        {shortDescription}
        <div className="ml-auto mt-auto flex items-center pt-2 font-bold text-teal">
          Ohjelmakartta
          <BsArrowRight className="ml-2 h-6 w-6" />
        </div>
      </div>
    </Link>
  );
};

export const getStaticProps: GetStaticProps<ArchivePageProps> = async () => {
  const content = await fetchContent<ArchivePageQuery>(ArchivePageDocument);
  const navigationItems = await fetchNavigationItems();

  const showLists: ShowList[] = content.programmeCollection.items;

  return {
    props: {
      navigationItems,
      showLists,
    },
  };
};

export default ArchivePage;
