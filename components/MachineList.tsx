import { Pressable, StyleSheet, Text, View } from "react-native";
import type { MachineState } from "../hooks/useFactoryData";
import StatusChip from "./StatusChip";
import { C, STATUS, T, card } from "./theme";

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
    <View style={card}>
      <View style={s.head}>
        <Text style={T.h2}>Assets</Text>
        <Text style={s.hint}>Select an asset</Text>
      </View>

      {machines.length === 0 && <Text style={s.hint}>No assets match your search.</Text>}

      {machines.map((m) => {
        const status = m.latest?.status ?? "normal";
        const selected = m.id === selectedId;
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect(m.id)}
            style={({ pressed }) => [
              s.item,
              {
                borderColor: selected ? C.accent : C.border,
                backgroundColor: selected ? C.accentSoft : C.surface,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={[s.bar, { backgroundColor: STATUS[status].color }]} />
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{m.name}</Text>
              <Text style={[s.sub, T.num]}>
                {m.latest
                  ? `${m.latest.temp.toFixed(0)} °C · ${m.latest.vibration.toFixed(1)} mm/s`
                  : "-"}
              </Text>
            </View>
            <StatusChip status={status} small />
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  hint: { color: C.muted, fontSize: 13 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  bar: { width: 5, alignSelf: "stretch", borderRadius: 3 },
  name: { color: C.text, fontSize: 16, fontWeight: "700" },
  sub: { color: C.muted, fontSize: 13, marginTop: 2 },
});