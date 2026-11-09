import { StyleSheet, Text, View } from "react-native";
import type { Alert } from "../hooks/useFactoryData";
import StatusChip from "./StatusChip";
import { C, STATUS, T, card } from "./theme";

export default function EventTable({
  alerts,
  query = "",
  compact = false,
  limit = 8,
  title = "Event Log",
}: {
  alerts: Alert[];
  query?: string;
  compact?: boolean;
  limit?: number;
  title?: string;
}) {
  const q = query.trim().toLowerCase();
  const rows = alerts.filter(
    (a) =>
      !q ||
      a.machineName.toLowerCase().includes(q) ||
      a.message.toLowerCase().includes(q)
  );
  const shown = rows.slice(0, limit);

  return (
    <View style={card}>
      <View style={s.head}>
        <Text style={T.h2}>{title}</Text>
        <Text style={s.count}>
          {rows.length} {rows.length === 1 ? "event" : "events"}
        </Text>
      </View>

      <View style={s.row}>
        <Text style={[T.label, { flex: 2.4 }]}>ASSET</Text>
        {!compact && <Text style={[T.label, { flex: 1.3 }]}>EVENT ID</Text>}
        <Text style={[T.label, { flex: 1.2 }]}>TIME</Text>
        <Text style={[T.label, { flex: 1.5 }]}>STATUS</Text>
      </View>

      {shown.length === 0 && <Text style={s.empty}>No events recorded.</Text>}

      {shown.map((a) => (
        <View key={a.id} style={[s.row, s.body]}>
          <View style={{ flex: 2.4, flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View style={[s.dot, { backgroundColor: STATUS[a.status].color }]} />
            <View style={{ flex: 1 }}>
              <Text style={s.asset}>{a.machineName}</Text>
              <Text style={s.msg}>{a.message}</Text>
            </View>
          </View>
          {!compact && (
            <Text style={[s.cell, T.num, { flex: 1.3 }]}>
              EVT-{String(a.id + 1).padStart(4, "0")}
            </Text>
          )}
          <Text style={[s.cell, T.num, { flex: 1.2 }]}>
            {new Date(a.time).toLocaleTimeString("en-GB")}
          </Text>
          <View style={{ flex: 1.5 }}>
            <StatusChip status={a.status} small />
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  count: { color: C.muted, fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 8 },
  body: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
  asset: { color: C.text, fontSize: 14, fontWeight: "700" },
  msg: { color: C.muted, fontSize: 12, marginTop: 2 },
  cell: { color: C.text, fontSize: 13 },
  empty: { color: C.muted, fontSize: 14, paddingVertical: 12 },
});