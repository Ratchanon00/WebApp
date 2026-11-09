import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import type { MachineState, Status } from "../hooks/useFactoryData";
import StatusChip from "./StatusChip";
import { C, card, LIMITS, STATUS, statusOf, T } from "./theme";

const ACTION: Record<Status, string> = {
  normal: "No action required.",
  warning: "Increase monitoring frequency and schedule an inspection.",
  critical: "Stop the asset and notify maintenance for inspection.",
};

type Limit = (typeof LIMITS)["temp"];

function Tile({ wide, children }: { wide: boolean; children: React.ReactNode }) {
  return <View style={[s.tile, wide && { flex: 1 }]}>{children}</View>;
}

function Gauge({ value, lim }: { value: number; lim: Limit }) {
  const pos = Math.min(Math.max((value - lim.min) / (lim.max - lim.min), 0), 1) * 100;
  return (
    <View style={s.gaugeWrap}>
      <View style={s.track}>
        <View style={{ flex: lim.warn - lim.min, backgroundColor: STATUS.normal.color }} />
        <View style={{ flex: lim.crit - lim.warn, backgroundColor: STATUS.warning.color }} />
        <View style={{ flex: lim.max - lim.crit, backgroundColor: STATUS.critical.color }} />
      </View>
      <View style={[s.marker, { left: `${pos}%` }]} />
    </View>
  );
}

function Metric({
  value,
  lim,
  decimals,
  wide,
}: {
  value: number;
  lim: Limit;
  decimals: number;
  wide: boolean;
}) {
  const status = statusOf(value, lim.warn, lim.crit);
  const st = STATUS[status];
  const hint =
    status === "normal"
      ? `Within limits (below ${lim.warn} ${lim.unit})`
      : status === "warning"
      ? `Above warning limit (${lim.warn} ${lim.unit})`
      : `Above critical limit (${lim.crit} ${lim.unit})`;

  return (
    <Tile wide={wide}>
      <Text style={s.label}>{lim.label}</Text>
      <View style={s.valueRow}>
        <Text style={[s.value, T.num, { color: status === "normal" ? C.text : st.color }]}>
          {value.toFixed(decimals)}
        </Text>
        <Text style={s.unit}>{lim.unit}</Text>
      </View>
      <Gauge value={value} lim={lim} />
      <Text style={[s.hint, { color: st.color }]}>
        {st.icon} {hint}
      </Text>
    </Tile>
  );
}

export default function MachineDetail({ machine }: { machine: MachineState }) {
  const { width } = useWindowDimensions();
  const wide = width >= 700;
  const r = machine.latest;
  if (!r) return null;
  const st = STATUS[r.status];

  return (
    <View style={card}>
      <View style={s.head}>
        <Text style={T.h2}>{machine.name}</Text>
        <StatusChip status={r.status} />
      </View>

      <View style={[s.metrics, wide && s.metricsWide]}>
        <Metric value={r.temp} lim={LIMITS.temp} decimals={1} wide={wide} />
        <Metric value={r.vibration} lim={LIMITS.vibration} decimals={2} wide={wide} />
        <Tile wide={wide}>
          <Text style={s.label}>Speed</Text>
          <View style={s.valueRow}>
            <Text style={[s.value, T.num]}>{r.rpm.toFixed(0)}</Text>
            <Text style={s.unit}>RPM</Text>
          </View>
        </Tile>
      </View>

      <View style={[s.action, { borderColor: st.color, backgroundColor: st.soft }]}>
        <Text style={T.label}>RECOMMENDED ACTION</Text>
        <Text style={s.actionText}>{ACTION[r.status]}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  metrics: { gap: 12 },
  metricsWide: { flexDirection: "row" },
  tile: { backgroundColor: C.surface2, borderRadius: 14, padding: 14 },
  label: { color: C.muted, fontSize: 13, fontWeight: "600" },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 4 },
  value: { color: C.text, fontSize: 34, fontWeight: "800" },
  unit: { color: C.muted, fontSize: 15, fontWeight: "600" },
  gaugeWrap: { height: 18, justifyContent: "center", marginTop: 10 },
  track: { flexDirection: "row", height: 8, borderRadius: 4, overflow: "hidden" },
  marker: {
    position: "absolute",
    marginLeft: -3,
    width: 6,
    height: 18,
    borderRadius: 3,
    backgroundColor: C.text,
    borderWidth: 1.5,
    borderColor: C.surface2,
  },
  hint: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  action: { marginTop: 14, padding: 14, borderRadius: 12, borderWidth: 1.5 },
  actionText: { color: C.text, fontSize: 16, fontWeight: "700", marginTop: 4 },
});