import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Footer from '@/components/footer';
import Hero from '@/components/hero';
import RichText from '@/components/richtext';
import {
  fetchContent,
  fetchNavigationItems,
  NavigationItem,
} from '@/contentful/client';
import {
  ContentPageDocument,
  ContentPageQuery,
} from '@/contentful/graphql/contentPage.graphql';
import {
  ContentPagePathsDocument,
  ContentPagePathsQuery,
} from '@/contentful/graphql/contentPagePaths.graphql';

interface ContentPageProps {
  name: string;
  description: string;
  heroImage: {
    url?: string;
  };
  heroSubtext: string;
  heroButtonText: string;
  heroButtonLink: string;
  navigationItems: NavigationItem[];
  content: any;
}

const ContentPage: NextPage<ContentPageProps> = ({
  name,
  description,
  heroImage,
  heroSubtext,
  heroButtonText,
  heroButtonLink,
  navigationItems,
  content,
}) => {
  const title = `${name} | Turun Wappuradio`;

  return (
    <div className="min-h-screen w-full">
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        {heroSubtext && <meta name="description" content={heroSubtext} />}
        {heroSubtext && <meta name="og:description" content={heroSubtext} />}
        {heroSubtext && (
          <meta name="twitter:description" content={heroSubtext} />
        )}
      </Head>
      <Hero
        image={heroImage}
        title={name}
        subtext={heroSubtext}
        buttonLink={heroButtonLink}
        buttonText={heroButtonText}
        navigationItems={navigationItems}
        isCompact={true}
      />
      <article className="mx-auto max-w-4xl pt-12 text-white">
        <RichText content={content} />
      </article>
      <Footer navigationItems={navigationItems} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pathsResult = await fetchContent<ContentPagePathsQuery>(
    ContentPagePathsDocument,
  );
  const paths = pathsResult.contentPageCollection.items.map((item) => ({
    params: { slug: item.slug.split('/') },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ContentPageProps> = async (
  context,
) => {
  const { slug } = context.params;

  const slugJoined = typeof slug === 'string' ? slug : slug.join('/');

  const data = await fetchContent<ContentPageQuery>(ContentPageDocument, {
    slug: slugJoined,
  });
  const {
    name,
    description,
    heroImage,
    heroSubtext,
    heroButtonLink,
    heroButtonText,
    content,
  } = data.contentPageCollection.items[0];

  const navigationItems = await fetchNavigationItems();

  return {
    props: {
      name,
      description,
      heroImage,
      heroSubtext,
      heroButtonLink,
      heroButtonText,
      navigationItems,
      content,
    },
  };
};

export default ContentPage;
