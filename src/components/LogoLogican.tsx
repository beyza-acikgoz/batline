import Image from "next/image";
import Link from "next/link";

export default function LogoLogican() {
  return (
    <Link
      href="https://logican.com.tr"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/logicanlogo.png"
        alt="Logican Logo"
        width={100}
        height={100}
        className="cursor-pointer"
      />
    </Link>
  );
}
