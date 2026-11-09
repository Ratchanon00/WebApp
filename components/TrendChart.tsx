import { Fragment, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import type { MachineState } from "../hooks/useFactoryData";
import { C, LIMITS, SERIES, STATUS, T, card } from "./theme";

type Metric = "temp" | "vibration";
type Pt = [number, number];

const MAX_POINTS = 30;
const H = 210;
const PAD_L = 38;
const PAD_R = 10;
const PAD_Y = 14;

function smooth(pts: Pt[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  if (pts.length === 1) return d;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q ${pts[i][0]} ${pts[i][1]} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

export default function TrendChart({ machines }: { machines: MachineState[] }) {
  const [metric, setMetric] = useState<Metric>("temp");
  const [w, setW] = useState(480);

  const lim = LIMITS[metric];
  const base = H - PAD_Y;

  const x = (i: number, n: number) =>
    PAD_L + (w - PAD_L - PAD_R) * (1 - (n - 1 - i) / (MAX_POINTS - 1));
  const y = (v: number) => {
    const c = Math.min(Math.max(v, lim.min), lim.max);
    return base - ((c - lim.min) / (lim.max - lim.min)) * (H - 2 * PAD_Y);
  };

  const series = machines.map((m, idx) => {
    const vals = m.history.map((r) => (metric === "temp" ? r.temp : r.vibration));
    const pts: Pt[] = vals.map((v, i) => [x(i, vals.length), y(v)]);
    return { name: m.name, pts, color: SERIES[idx % SERIES.length] };
  });

  const ticks = [0, 1, 2, 3].map((k) => lim.min + ((lim.max - lim.min) * k) / 3);

  const tabs: { key: Metric; label: string }[] = [
    { key: "temp", label: "Temperature" },
    { key: "vibration", label: "Vibration" },
  ];

  return (
    <View style={card}>
      <View style={s.head}>
        <View>
          <Text style={T.h2}>Fleet Trend</Text>
          <Text style={T.sub}>
            Last 30 seconds · {lim.label} ({lim.unit})
          </Text>
        </View>
        <View style={s.tabs}>
          {tabs.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setMetric(t.key)}
              style={[s.tab, metric === t.key && s.tabActive]}
            >
              <Text style={[s.tabText, metric === t.key && s.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        <Svg width={w} height={H}>
          <Defs>
            {series.map((sr, i) => (
              <LinearGradient key={i} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={sr.color} stopOpacity={0.22} />
                <Stop offset="1" stopColor={sr.color} stopOpacity={0} />
              </LinearGradient>
            ))}
          </Defs>

          {ticks.map((t, i) => (
            <Fragment key={i}>
              <Line
                x1={PAD_L}
                x2={w - PAD_R}
                y1={y(t)}
                y2={y(t)}
                stroke={C.border}
                strokeWidth={1}
              />
              <SvgText x={0} y={y(t) + 3} fontSize={10} fill={C.muted}>
                {String(Math.round(t * 10) / 10)}
              </SvgText>
            </Fragment>
          ))}

          <Line
            x1={PAD_L}
            x2={w - PAD_R}
            y1={y(lim.warn)}
            y2={y(lim.warn)}
            stroke={STATUS.warning.color}
            strokeWidth={1.2}
            strokeDasharray="5 5"
          />
          <Line
            x1={PAD_L}
            x2={w - PAD_R}
            y1={y(lim.crit)}
            y2={y(lim.crit)}
            stroke={STATUS.critical.color}
            strokeWidth={1.2}
            strokeDasharray="5 5"
          />

          {series.map((sr, i) =>
            sr.pts.length > 1 ? (
              <Fragment key={i}>
                <Path
                  d={`${smooth(sr.pts)} L ${sr.pts[sr.pts.length - 1][0]} ${base} L ${sr.pts[0][0]} ${base} Z`}
                  fill={`url(#area-${i})`}
                />
                <Path
                  d={smooth(sr.pts)}
                  fill="none"
                  stroke={sr.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <Circle
                  cx={sr.pts[sr.pts.length - 1][0]}
                  cy={sr.pts[sr.pts.length - 1][1]}
                  r={4.5}
                  fill={sr.color}
                  stroke="white"
                  strokeWidth={2}
                />
              </Fragment>
            ) : null
          )}
        </Svg>
      </View>

      <View style={s.legend}>
        {series.map((sr) => (
          <View key={sr.name} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: sr.color }]} />
            <Text style={s.legendText}>{sr.name}</Text>
          </View>
        ))}
        <Text style={s.limits}>
          <Text style={{ color: STATUS.warning.color }}>- - </Text>
          Warning {lim.warn} {lim.unit}
          {"   "}
          <Text style={{ color: STATUS.critical.color }}>- - </Text>
          Critical {lim.crit} {lim.unit}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  tabs: { flexDirection: "row", gap: 6 },
  tab: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: C.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: { backgroundColor: C.accent },
  tabText: { color: C.muted, fontSize: 14, fontWeight: "700" },
  tabTextActive: { color: "white" },
  legend: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 14, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: C.text, fontSize: 13, fontWeight: "600" },
  limits: { color: C.muted, fontSize: 12 },
});