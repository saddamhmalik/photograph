import { cn, getMediaUrl } from "@/lib/utils";

type MediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function MediaImage({
  src,
  alt,
  className,
  fill,
  priority,
  width,
  height,
}: MediaImageProps) {
  const url = getMediaUrl(src);
  if (!url) return null;

  if (fill) {
    return (
      <img
        src={url}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
