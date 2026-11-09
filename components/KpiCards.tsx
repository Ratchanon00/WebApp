import { StyleSheet, Text, View } from "react-native";
import type { MachineState, Reading } from "../hooks/useFactoryData";
import { C, STATUS, T, card } from "./theme";

export default function KpiCards({ machines }: { machines: MachineState[] }) {
  const readings = machines
    .map((m) => m.latest)
    .filter((r): r is Reading => r !== undefined);
  const count = (st: string) => readings.filter((r) => r.status === st).length;
  const warn = count("warning");
  const crit = count("critical");
  const avg = readings.length
    ? readings.reduce((a, r) => a + r.temp, 0) / readings.length
    : 0;

  const items = [
    {
      label: "Assets Monitored",
      value: String(machines.length),
      unit: "",
      caption: `${count("normal")} operating normally`,
      dot: C.accent,
      valueColor: C.text,
    },
    {
      label: "Warnings",
      value: String(warn),
      unit: "",
      caption: "Above warning limit",
      dot: warn > 0 ? STATUS.warning.color : "#cbd5e1",
      valueColor: warn > 0 ? STATUS.warning.color : C.text,
    },
    {
      label: "Critical",
      value: String(crit),
      unit: "",
      caption: "Above critical limit",
      dot: crit > 0 ? STATUS.critical.color : "#cbd5e1",
      valueColor: crit > 0 ? STATUS.critical.color : C.text,
    },
    {
      label: "Avg. Temperature",
      value: avg.toFixed(1),
      unit: "°C",
      caption: "Fleet average",
      dot: "#cbd5e1",
      valueColor: C.text,
    },
  ];

  return (
    <View style={s.grid}>
      {items.map((it) => (
        <View key={it.label} style={[card, s.item]}>
          <View style={s.labelRow}>
            <View style={[s.dot, { backgroundColor: it.dot }]} />
            <Text style={s.label}>{it.label}</Text>
          </View>
          <View style={s.valueRow}>
            <Text style={[s.value, T.num, { color: it.valueColor }]}>{it.value}</Text>
            {it.unit !== "" && <Text style={s.unit}>{it.unit}</Text>}
          </View>
          <Text style={s.caption}>{it.caption}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  item: { flexGrow: 1, flexBasis: "45%", minWidth: 140, padding: 16 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { color: C.muted, fontSize: 13, fontWeight: "600" },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 8 },
  value: { fontSize: 36, fontWeight: "800" },
  unit: { color: C.muted, fontSize: 16, fontWeight: "600" },
  caption: { color: C.muted, fontSize: 12, marginTop: 4 },
});