import { cn } from "#/lib/utils";

type Ratio = "original" | "1:1" | "1:2";

interface ImageProps {
  src: string;
  alt?: string;
  ratio?: Ratio;
  size?: number;
  className?: string;
}

export function Image({
  src,
  alt = "",
  ratio = "original",
  size,
  className,
}: ImageProps) {
  const isOriginal = ratio === "original";

  const containerStyle: React.CSSProperties = {
    ...(size && { width: size }),
    ...(!isOriginal && { aspectRatio: ratio.replace(":", " / ") }),
  };

  return (
    <div
      style={containerStyle}
      className={cn(!isOriginal && "overflow-hidden", className)}
    >
      <img
        src={src}
        alt={alt}
        className={
          isOriginal ? "w-full object-contain" : "w-full h-full object-cover"
        }
      />
    </div>
  );
}
