import Image from 'next/legacy/image';
import Link from 'next/link';
import { FC, useState } from 'react';

import { NavigationItem } from '@/contentful/client';
import { contentfulImageLoader } from '@/contentful/contentfulImageLoader';
import heroImage from '../public/hero.webp';
import { LinkButton } from './button';
import Hamburger from './hamburger/hamburger';
import Menu from './menu';

interface HeroProps {
  image?: {
    url?: string;
  };
  title: string;
  subtext: string;
  buttonText?: string;
  buttonLink?: string;
  navigationItems: NavigationItem[];
  isCompact?: boolean;
}

const Hero: FC<HeroProps> = ({
  image,
  title,
  subtext,
  buttonText,
  buttonLink,
  navigationItems,
  isCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const url = image?.url || heroImage;
  const imageLoader = image?.url ? contentfulImageLoader : undefined;

  const handleHamburgerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`relative flex w-full flex-col py-2 ${
          isCompact ? 'h-72' : 'h-128 xl:h-160'
        }`}
      >
        {/* Hero image */}
        <Image
          src={url}
          loader={imageLoader}
          unoptimized={!image?.url}
          priority={true}
          quality={50}
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-[10%] grayscale"
          alt=""
        />

        {/* Navigation */}
        <header className="z-10 mx-auto h-16 w-screen max-w-4xl">
          {/* Desktop navigation bar */}
          <ul className="hidden w-full justify-end md:flex">
            <NavLink href="/" name="Radio" />

            {navigationItems.map(({ name, slug }) => (
              <NavLink key={slug} href={`/${slug}`} name={name} />
            ))}

            <NavLink href="/arkisto" name="Arkisto" />
            <NavLink href="/esittelyt" name="Esittelyt" />
          </ul>
        </header>

        {/* Hero content */}
        <div className="z-10 mx-auto flex h-full w-[21rem] max-w-full flex-col items-center px-2 md:w-[59rem] md:flex-row">
          <div
            className={`relative ${
              isCompact
                ? 'h-44 w-44 md:mr-4 md:h-52 md:w-52'
                : 'h-52 w-52 lg:h-80 lg:w-80 xl:h-96 xl:w-96'
            }`}
          >
            <Image
              src="/leima.svg"
              layout="fill"
              priority={true}
              alt="Logo of Turun Wappuradio ry"
              unoptimized={true}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="my-1 text-[1.2rem] font-bold text-coral md:my-1 md:text-4xl">
              {title}
            </h1>
            <p className="text-md my-1 text-white md:text-xl">{subtext}</p>

            {buttonText && buttonLink ? (
              <LinkButton
                className={`${
                  isCompact ? 'md:text-md text-sm' : 'text-md md:text-xl'
                } my-3 ml-auto`}
                href={buttonLink}
              >
                {buttonText}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </div>
      {/* Mobile hamburger menu */}
      <Hamburger
        className="fixed right-0 top-0 z-50 md:hidden"
        isOpen={isOpen}
        onClick={handleHamburgerClick}
      />
      <Menu
        navigationItems={navigationItems}
        isOpen={isOpen}
        closeMenu={handleMenuClose}
      />
    </>
  );
};

const NavLink = ({ href, name }: { href: string; name: string }) => (
  <li className="p-4">
    <Link
      href={href}
      className="text-xl text-white transition hover:text-coral"
    >
      {name}
    </Link>
  </li>
);

export default Hero;
