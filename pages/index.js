import Head from 'next/head';
import Image from 'next/image';

import RichText from 'components/richtext';
import { fetchContent } from 'utils/contentful';
import Hero from 'components/hero';

export default function Home({ content, heroImage }) {
  return (
    <div className="min-h-screen w-screen">
      <Head>
        <title>Turun Wappuradio</title>
        <meta name="description" content="Wappuradioo tält puolt jokkee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero image={heroImage} />
      <div className="mx-auto pt-12 max-w-4xl text-white">
        <RichText content={content} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // find the ID of our index object.
  const idQuery = `
  {
    indexCollection {
      items {
        sys {
          id
        }
      }
    }
  }
  `;
  const idResult = await fetchContent(idQuery);

  // there can be only one index object, so we'll just grab the first one.
  const indexId = idResult.indexCollection.items[0].sys.id;

  // find the content of our index object.
  const contentQuery = `
  {
    index(id: "${indexId}") {
      heroImage {
        url
      }
      content {
        json
        links {
          assets {
            block {
              sys { id }
              url
              width
              height
            }
          }
        }
      }
    }
  }
  `;

  const contentResult = await fetchContent(contentQuery);

  const { heroImage, content } = contentResult.index;

  return {
    props: {
      heroImage,
      content
    }
  };
}
