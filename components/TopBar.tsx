import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Status } from "../hooks/useFactoryData";
import Icon from "./Icon";
import { LiveBadge } from "./Nav";
import { C, STATUS } from "./theme";

export default function TopBar({
  query,
  onQuery,
  level,
  onBell,
  narrow,
}: {
  query: string;
  onQuery: (q: string) => void;
  level: Status;
  onBell: () => void;
  narrow: boolean;
}) {
  return (
    <View style={{ gap: 14 }}>
      {narrow && (
        <View style={s.brandRow}>
          <Text style={s.brand}>PumpTwin</Text>
          <LiveBadge />
        </View>
      )}

      <View style={s.row}>
        <View style={s.search}>
          <Icon name="search" color={C.muted} size={18} />
          <TextInput
            value={query}
            onChangeText={onQuery}
            placeholder="Search assets or events…"
            placeholderTextColor={C.muted}
            style={[s.input, { outlineStyle: "none" } as any]}
          />
        </View>

        <Pressable onPress={onBell} style={s.round}>
          <Icon name="events" color={C.text} size={20} />
          {level !== "normal" && (
            <View style={[s.badge, { backgroundColor: STATUS[level].color }]} />
          )}
        </Pressable>

        <View style={[s.round, s.avatar]}>
          <Text style={s.avatarText}>OP</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: C.text, fontSize: 22, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  search: {
    flex: 1,
    maxWidth: 420,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  input: { flex: 1, color: C.text, fontSize: 15, height: 44 },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: C.surface,
  },
  avatar: { backgroundColor: C.accentSoft, borderColor: C.accentSoft },
  avatarText: { color: C.accent, fontWeight: "800", fontSize: 14 },
});