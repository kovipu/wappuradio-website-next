import Image from 'next/legacy/image';
import Link from 'next/link';
import {
  AiFillFacebook,
  AiFillGithub,
  AiOutlineInstagram,
  AiOutlineMail,
} from 'react-icons/ai';
import { FaDiscord, FaTelegramPlane } from 'react-icons/fa';

import { NavigationItem } from '@/contentful/client';

interface FooterProps {
  navigationItems: NavigationItem[];
}

const Footer = ({ navigationItems }: FooterProps) => {
  return (
    <footer className="z-15 flex max-w-full flex-col flex-wrap items-center justify-center bg-blue-darkest py-14 pb-32 text-white lg:flex-row">
      <div className="flex w-64 max-w-full justify-center lg:justify-start xl:w-128">
        <div className="flex w-fit flex-col items-center">
          <div className="relative flex h-36 w-36 md:h-52 md:w-52">
            <Image
              src="/leima.svg"
              unoptimized={true}
              layout="fill"
              alt="Logo of Turun Wappuradio ry"
            />
          </div>
          <Link
            href="/tietosuojaseloste"
            className="mt-6 text-sm text-white opacity-50"
          >
            © Turun Wappuradio ry
            <br />
            Tietosuojaseloste
          </Link>
        </div>
      </div>

      <div className="flex w-128 max-w-full flex-row">
        <div className="my-4 hidden lg:block">
          <SiteMap navigationItems={navigationItems} />
        </div>
        <Socials />
      </div>
    </footer>
  );
};

const SiteMap = ({ navigationItems }: FooterProps) => (
  <ul className="w-64">
    <NavLink slug="" name="Radio" />
    {navigationItems.map((navItem) => (
      <NavLink {...navItem} key={navItem.name} />
    ))}
    <NavLink slug="arkisto" name="Arkisto" />
  </ul>
);

interface NavLinkProps {
  slug?: string;
  name?: string;
}

const NavLink = ({ slug, name }: NavLinkProps) => (
  <li key={slug} className="my-3">
    <Link href={'/' + slug} className="font-bold hover:underline">
      {name}
    </Link>
  </li>
);

const Socials = () => (
  <ul className="mx-auto my-4 flex w-64 flex-row items-center justify-around lg:block lg:w-full">
    <SomeLink
      text="@turunwappuradio"
      LogoComponent={AiOutlineInstagram}
      href="https://instagram.com/turunwappuradio"
      ariaLabel="Instagram"
    />
    <SomeLink
      text="@turunwappuradio"
      LogoComponent={AiFillFacebook}
      href="https://facebook.com/turunwappuradio/"
      ariaLabel="Facebook"
    />
    <SomeLink
      text="Discord-serveri"
      LogoComponent={FaDiscord}
      href="https://discord.gg/CpnVGckP9Z"
      ariaLabel="Discord"
    />
    <SomeLink
      text="t.me/turunwappuradio"
      LogoComponent={FaTelegramPlane}
      href="https://t.me/turunwappuradio"
      ariaLabel="Telegram"
    />
    <SomeLink
      text="Sähköposti"
      LogoComponent={AiOutlineMail}
      href="mailto:toimitus@turunwappuradio.com"
      ariaLabel="Email"
    />
    <SomeLink
      text="TurunWappuradio"
      LogoComponent={AiFillGithub}
      href="https://github.com/TurunWappuradio"
      ariaLabel="GitHub"
    />
  </ul>
);

interface SomeLinkProps {
  text: string;
  href: string;
  LogoComponent: any;
  ariaLabel: string;
}

const SomeLink = ({ text, href, LogoComponent, ariaLabel }: SomeLinkProps) => {
  return (
    <li className="my-3">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        className="flex items-center transition hover:underline"
      >
        <LogoComponent className="h-6 w-6" />
        <span className="ml-3 hidden lg:block">{text}</span>
      </a>
    </li>
  );
};

export default Footer;
