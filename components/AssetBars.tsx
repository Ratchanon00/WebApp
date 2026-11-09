import { StyleSheet, Text, View } from "react-native";
import type { MachineState } from "../hooks/useFactoryData";
import { C, card, LIMITS, SERIES, STATUS, statusOf, T } from "./theme";

const COL = 64;

export default function AssetBars({ machines }: { machines: MachineState[] }) {
  const lim = LIMITS.vibration;
  const pct = (v: number) => Math.min(Math.max(v / lim.max, 0), 1) * 100;

  return (
    <View style={card}>
      <Text style={T.h2}>Vibration by Asset</Text>
      <Text style={T.sub}>Current RMS velocity (mm/s)</Text>

      <View style={s.plot}>
        <View
          style={[s.limit, { bottom: `${pct(lim.warn)}%`, backgroundColor: STATUS.warning.color }]}
        />
        <View
          style={[s.limit, { bottom: `${pct(lim.crit)}%`, backgroundColor: STATUS.critical.color }]}
        />
        {machines.map((m, i) => {
          const v = m.latest?.vibration ?? 0;
          const status = statusOf(v, lim.warn, lim.crit);
          const color = status === "normal" ? SERIES[i % SERIES.length] : STATUS[status].color;
          return (
            <View key={m.id} style={s.col}>
              <View style={s.track}>
                <View style={[s.fill, { height: `${pct(v)}%`, backgroundColor: color }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={s.labels}>
        {machines.map((m) => (
          <View key={m.id} style={s.label}>
            <Text style={s.name}>{m.name.split(" ").pop()}</Text>
            <Text style={[s.value, T.num]}>
              {m.latest ? m.latest.vibration.toFixed(2) : "-"}
            </Text>
          </View>
        ))}
      </View>

      <Text style={s.legend}>
        <Text style={{ color: STATUS.warning.color }}>━ </Text>
        Warning {lim.warn} {lim.unit}
        {"   "}
        <Text style={{ color: STATUS.critical.color }}>━ </Text>
        Critical {lim.crit} {lim.unit}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  plot: {
    height: 160,
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  limit: { position: "absolute", left: 0, right: 0, height: 1, opacity: 0.6 },
  col: { width: COL, height: "100%", alignItems: "center", justifyContent: "flex-end" },
  track: {
    width: 16,
    height: "100%",
    borderRadius: 8,
    backgroundColor: C.surface2,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: { width: "100%", borderRadius: 8 },
  labels: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  label: { width: COL, alignItems: "center" },
  name: { color: C.text, fontSize: 12, fontWeight: "700" },
  value: { color: C.muted, fontSize: 12, marginTop: 2 },
  legend: { color: C.muted, fontSize: 12, marginTop: 12 },
});