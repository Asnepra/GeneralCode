'use client'

import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();
  return (
    <Link href="/">
        <Image className="cursor-pointer" alt="Logo" src="/images/Indian_Oil_Logo.png" height={30} width={30}
         />
    </Link>
  )
}

export default Logo;