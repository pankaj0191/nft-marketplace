import { useRouter } from 'next/router'
import Link from "next/link";
import { ReactNode } from 'react';

interface CustomNavLinkProps {
  children: ReactNode;
  url: any;
  href: string;
}

function CustomNavLink({ children, url, href }: CustomNavLinkProps) {
  const router = useRouter();
  const activeLinkClass = url.includes(router.pathname) ? ' active' : '';

  return (
    <li className="nav-item">
      <Link href={href} passHref>
        <a className={`px-3 py-2 flex items-center text-sm uppercase font-bold leading-snug text-[#fff] hover:text-[#fff]${activeLinkClass}`}>
          {children}
        </a>
      </Link>
    </li>




  )
}

export default CustomNavLink