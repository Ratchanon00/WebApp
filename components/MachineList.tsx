import { Pressable, StyleSheet, Text, View } from "react-native";
import type { MachineState } from "../hooks/useFactoryData";

const COLORS = { normal: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };

export default function MachineList({
  machines,
  selectedId,
  onSelect,
}: {
  machines: MachineState[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={s.box}>
      <Text style={s.title}>Machines</Text>
      {machines.map((m) => {
        const status = m.latest?.status ?? "normal";
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect(m.id)}
            style={[s.item, m.id === selectedId && s.selected]}
          >
            <View style={[s.dot, { backgroundColor: COLORS[status] }]} />
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{m.name}</Text>
              <Text style={s.sub}>
                {m.latest
                  ? `${m.latest.temp.toFixed(1)} °C · vib ${m.latest.vibration.toFixed(2)}`
                  : "-"}
              </Text>
            </View>
            <Text style={[s.status, { color: COLORS[status] }]}>
              {status.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, backgroundColor: "#1e293b", padding: 12, borderRadius: 8 },
  title: { color: "white", fontWeight: "700", marginBottom: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selected: { borderColor: "#38bdf8", backgroundColor: "#0f172a" },
  dot: { width: 12, height: 12, borderRadius: 6 },
  name: { color: "white", fontWeight: "600" },
  sub: { color: "#94a3b8", fontSize: 12 },
  status: { fontSize: 11, fontWeight: "700" },
});