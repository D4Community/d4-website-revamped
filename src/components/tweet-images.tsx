import Image from "next/image";
import type { TwitterComponents } from "react-tweet";

function TweetAvatar({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={`${width}px`}
      className="h-full w-full object-cover"
    />
  );
}

function TweetMediaImage({
  src,
  alt,
  className,
  draggable,
}: {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, 320px"
      className={className}
      draggable={draggable}
    />
  );
}

export const tweetImages: TwitterComponents = {
  AvatarImg: TweetAvatar,
  MediaImg: TweetMediaImage,
};
