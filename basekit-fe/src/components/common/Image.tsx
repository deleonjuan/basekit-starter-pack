import { cn } from "#/lib/utils";

export type Ratio = "original" | "1:1" | "1:2" | "3:2";

interface ImageProps {
  src: string;
  alt?: string;
  ratio?: Ratio;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export function Image({
  src,
  alt = "",
  ratio = "original",
  size,
  className,
  fallback,
}: ImageProps) {
  const isOriginal = ratio === "original";

  const containerStyle: React.CSSProperties = {
    ...(size && { width: size }),
    ...(!isOriginal && { aspectRatio: ratio.replace(":", " / ") }),
  };

  return (
    <div
      style={containerStyle}
      className={cn(
        !isOriginal && "overflow-hidden",
        !src && fallback && "flex items-center justify-center",
        className,
      )}
    >
      {!src && fallback ? (
        fallback
      ) : (
        <img
          src={src}
          alt={alt}
          className={
            isOriginal ? "w-full object-contain" : "w-full h-full object-cover"
          }
        />
      )}
    </div>
  );
}
