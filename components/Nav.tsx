import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { IconName } from "./Icon";
import Icon from "./Icon";
import { C, STATUS } from "./theme";

export type ViewKey = "dashboard" | "assets" | "events";

const ITEMS: { key: ViewKey; label: string; icon: IconName }[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "assets", label: "Assets", icon: "assets" },
  { key: "events", label: "Events", icon: "events" },
];

export function LiveBadge() {
  return (
    <View style={s.live}>
      <View style={s.liveDot} />
      <Text style={s.liveText}>LIVE · 1 Hz</Text>
    </View>
  );
}

export function Sidebar({
  view,
  onChange,
}: {
  view: ViewKey;
  onChange: (v: ViewKey) => void;
}) {
  return (
    <View style={s.sidebar}>
      <View style={s.brand}>
        <View style={s.logo}>
          <Text style={s.logoText}>P</Text>
        </View>
        <Text style={s.brandText}>PumpTwin</Text>
      </View>

      {ITEMS.map((it) => {
        const active = it.key === view;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={[s.item, active && s.itemActive]}
          >
            <Icon name={it.icon} color={active ? C.accent : C.muted} />
            <Text style={[s.itemText, active && s.itemTextActive]}>{it.label}</Text>
          </Pressable>
        );
      })}

      <View style={{ flex: 1 }} />
      <LiveBadge />
    </View>
  );
}

export function TabBar({
  view,
  onChange,
}: {
  view: ViewKey;
  onChange: (v: ViewKey) => void;
}) {
  return (
    <View style={s.tabbar}>
      {ITEMS.map((it) => {
        const active = it.key === view;
        return (
          <Pressable key={it.key} onPress={() => onChange(it.key)} style={s.tab}>
            <Icon name={it.icon} color={active ? C.accent : C.muted} />
            <Text style={[s.tabText, active && { color: C.accent }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  sidebar: {
    width: 232,
    backgroundColor: C.surface,
    borderRightWidth: 1,
    borderRightColor: C.border,
    padding: 20,
    gap: 6,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 22 },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "white", fontWeight: "800", fontSize: 18 },
  brandText: { color: C.text, fontSize: 19, fontWeight: "800" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
  },
  itemActive: { backgroundColor: C.accentSoft },
  itemText: { color: C.muted, fontSize: 15, fontWeight: "600" },
  itemTextActive: { color: C.accent, fontWeight: "700" },
  live: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: STATUS.normal.soft,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS.normal.color },
  liveText: { color: STATUS.normal.color, fontSize: 11, fontWeight: "700", letterSpacing: 0.6 },
  tabbar: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 26 : 10,
  },
  tab: { flex: 1, alignItems: "center", gap: 3 },
  tabText: { color: C.muted, fontSize: 11, fontWeight: "600" },
});