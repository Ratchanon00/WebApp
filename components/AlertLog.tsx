import { StyleSheet, Text, View } from "react-native";
import type { Alert } from "../hooks/useFactoryData";

const COLORS = { normal: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };

export default function AlertLog({ alerts }: { alerts: Alert[] }) {
  return (
    <View style={s.box}>
      <Text style={s.title}>Alert Log ({alerts.length})</Text>
      {alerts.length === 0 && <Text style={s.empty}>ยังไม่มีการแจ้งเตือน</Text>}
      {alerts.slice(0, 10).map((a) => (
        <View key={a.id} style={s.item}>
          <View style={[s.badge, { backgroundColor: COLORS[a.status] }]}>
            <Text style={s.badgeText}>{a.status.toUpperCase()}</Text>
          </View>
          <Text style={s.time}>{new Date(a.time).toLocaleTimeString("th-TH")}</Text>
          <Text style={s.machine}>{a.machineName}</Text>
          <Text style={s.msg}>{a.message}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  box: { backgroundColor: "#1e293b", padding: 12, borderRadius: 8, marginTop: 12 },
  title: { color: "white", fontWeight: "700", marginBottom: 8 },
  empty: { color: "#94a3b8" },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, minWidth: 74 },
  badgeText: { color: "white", fontSize: 11, fontWeight: "700", textAlign: "center" },
  time: { color: "#94a3b8" },
  machine: { color: "#38bdf8", fontWeight: "600" },
  msg: { color: "white", flexShrink: 1 },
});