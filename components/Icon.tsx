import Svg, { Circle, Path, Rect } from "react-native-svg";

export type IconName = "dashboard" | "assets" | "events" | "search";

export default function Icon({
  name,
  color,
  size = 20,
}: {
  name: IconName;
  color: string;
  size?: number;
}) {
  const p = {
    stroke: color,
    strokeWidth: 1.8,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === "dashboard" && (
        <>
          <Rect x={3} y={3} width={7} height={7} rx={1.5} {...p} />
          <Rect x={14} y={3} width={7} height={7} rx={1.5} {...p} />
          <Rect x={3} y={14} width={7} height={7} rx={1.5} {...p} />
          <Rect x={14} y={14} width={7} height={7} rx={1.5} {...p} />
        </>
      )}
      {name === "assets" && (
        <>
          <Path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" {...p} />
          <Path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" {...p} />
        </>
      )}
      {name === "events" && (
        <>
          <Path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" {...p} />
          <Path d="M10 21a2 2 0 0 0 4 0" {...p} />
        </>
      )}
      {name === "search" && (
        <>
          <Circle cx={11} cy={11} r={6.5} {...p} />
          <Path d="m20 20-4.2-4.2" {...p} />
        </>
      )}
    </Svg>
  );
}