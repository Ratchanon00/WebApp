import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AlertLog from "../../components/AlertLog";
import FactoryScene from "../../components/FactoryScene";
import MachineList from "../../components/MachineList";
import TrendChart from "../../components/TrendChart";
import { useFactoryData } from "../../hooks/useFactoryData";

const COLORS = { normal: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };

export default function Home() {
  const { machines, alerts } = useFactoryData();
  const [selectedId, setSelectedId] = useState("m1");

  const selected = machines.find((m) => m.id === selectedId)!;
  if (!selected.latest) return <Text>Loading...</Text>;

  const latest = selected.latest;
  const count = (st: string) =>
    machines.filter((m) => m.latest?.status === st).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.title}>PumpTwin</Text>
      <Text style={s.summary}>
        <Text style={{ color: COLORS.normal }}>● Normal {count("normal")}  </Text>
        <Text style={{ color: COLORS.warning }}>● Warning {count("warning")}  </Text>
        <Text style={{ color: COLORS.critical }}>● Critical {count("critical")}</Text>
      </Text>

      <View style={s.row}>
        <View style={{ flex: 3 }}>
          <FactoryScene
            machines={machines}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </View>
        <View style={{ flex: 1, minWidth: 260 }}>
          <MachineList
            machines={machines}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </View>
      </View>

      <Text style={s.section}>รายละเอียด : {selected.name}</Text>
      <View style={s.row}>
        <Card label="Temp (°C)" value={latest.temp.toFixed(1)} />
        <Card label="Vibration" value={latest.vibration.toFixed(2)} />
        <Card label="RPM" value={latest.rpm.toFixed(0)} />
        <Card
          label="Status"
          value={latest.status.toUpperCase()}
          color={COLORS[latest.status]}
        />
      </View>

      <View style={s.row}>
        <TrendChart
          title="Temperature (°C) – 30 sec"
          data={selected.history.map((r) => r.temp)}
          min={60} max={95} warn={75} crit={85}
          color="#38bdf8"
        />
        <TrendChart
          title="Vibration – 30 sec"
          data={selected.history.map((r) => r.vibration)}
          min={2} max={8.5} warn={5} crit={7}
          color="#a78bfa"
        />
      </View>

      <AlertLog alerts={alerts} />
    </ScrollView>
  );
}

const Card = ({
  label,
  value,
  color = "white",
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <View style={s.card}>
    <Text style={s.label}>{label}</Text>
    <Text style={[s.value, { color }]}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  title: { color: "white", fontSize: 22, fontWeight: "700" },
  summary: { marginTop: 6, marginBottom: 12, fontWeight: "600" },
  section: { color: "white", fontSize: 16, fontWeight: "700", marginTop: 20 },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  card: { flex: 1, backgroundColor: "#1e293b", padding: 12, borderRadius: 8 },
  label: { color: "#94a3b8" },
  value: { fontSize: 20, fontWeight: "700" },
});