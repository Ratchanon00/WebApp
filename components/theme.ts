import { StyleSheet } from "react-native";
import type { Status } from "../hooks/useFactoryData";

export const C = {
  bg: "#f4f6fb",
  surface: "#ffffff",
  surface2: "#f3f6fc",
  border: "#e6eaf3",
  text: "#0f172a",
  muted: "#6b7a99",
  accent: "#3b5bdb",
  accentSoft: "rgba(59,91,219,0.08)",
  canvas: "#eef2fa",
};

export const SERIES = ["#3b5bdb", "#22b8cf", "#8b5cf6", "#0ea5e9", "#64748b"];

export const STATUS: Record<
  Status,
  { color: string; soft: string; label: string; icon: string }
> = {
  normal: { color: "#12b76a", soft: "rgba(18,183,106,0.12)", label: "Normal", icon: "●" },
  warning: { color: "#f59e0b", soft: "rgba(245,158,11,0.16)", label: "Warning", icon: "▲" },
  critical: { color: "#e5484d", soft: "rgba(229,72,77,0.14)", label: "Critical", icon: "■" },
};

export const LIMITS = {
  temp: { label: "Temperature", unit: "°C", min: 55, max: 100, warn: 75, crit: 85 },
  vibration: { label: "Vibration (RMS)", unit: "mm/s", min: 1, max: 9, warn: 5, crit: 7 },
};

export function statusOf(value: number, warn: number, crit: number): Status {
  if (value > crit) return "critical";
  if (value > warn) return "warning";
  return "normal";
}

export const T = StyleSheet.create({
  h1: { color: C.text, fontSize: 24, fontWeight: "800" },
  h2: { color: C.text, fontSize: 17, fontWeight: "700" },
  sub: { color: C.muted, fontSize: 13, marginTop: 2 },
  label: { color: C.muted, fontSize: 12, fontWeight: "700", letterSpacing: 0.8 },
  num: { fontVariant: ["tabular-nums"] },
});

export const card = StyleSheet.create({
  c: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
}).c;