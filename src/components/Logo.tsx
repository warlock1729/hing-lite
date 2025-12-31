import Image, { ImageProps } from "next/image";
import React from "react";

type Props = Omit<ImageProps,'src'>

export default function Logo({alt,...props}:Props) {
  return (
    <Image
      src={'/logo.png'}
      width={40}
      height={20}
      alt={alt}
      className=""
      {...props}
    />
  );
}
