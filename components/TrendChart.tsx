import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";

type Props = {
  title: string;
  data: number[];
  min: number;
  max: number;
  warn: number;
  crit: number;
  color: string;
};

const MAX_POINTS = 30;
const H = 140;

export default function TrendChart({ title, data, min, max, warn, crit, color }: Props) {
  const [w, setW] = useState(300);

  const x = (i: number) =>
    w - ((data.length - 1 - i) / (MAX_POINTS - 1)) * w;
  const y = (v: number) => {
    const clamped = Math.min(Math.max(v, min), max);
    return H - ((clamped - min) / (max - min)) * H;
  };

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <View style={s.box}>
      <Text style={s.title}>{title}</Text>
      <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        <Svg width={w} height={H}>
          <Line x1={0} x2={w} y1={y(warn)} y2={y(warn)} stroke="#f59e0b" strokeDasharray="4 4" />
          <Line x1={0} x2={w} y1={y(crit)} y2={y(crit)} stroke="#ef4444" strokeDasharray="4 4" />
          {data.length > 1 && (
            <Polyline points={points} fill="none" stroke={color} strokeWidth={2} />
          )}
        </Svg>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, backgroundColor: "#1e293b", padding: 12, borderRadius: 8 },
  title: { color: "white", fontWeight: "700", marginBottom: 8 },
  legend: { color: "#94a3b8", fontSize: 11, marginTop: 6 },
});