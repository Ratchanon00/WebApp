import { StyleSheet, Text, View } from "react-native";
import type { Status } from "../hooks/useFactoryData";
import { STATUS } from "./theme";

export default function StatusChip({
  status,
  small = false,
}: {
  status: Status;
  small?: boolean;
}) {
  const st = STATUS[status];
  return (
    <View style={[s.chip, { backgroundColor: st.soft }, small && s.chipSm]}>
      <Text style={[s.icon, { color: st.color }]}>{st.icon}</Text>
      <Text style={[s.label, { color: st.color }, small && s.labelSm]}>
        {st.label.toUpperCase()}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  chipSm: { paddingHorizontal: 8, paddingVertical: 3 },
  icon: { fontSize: 9 },
  label: { fontSize: 12, fontWeight: "700", letterSpacing: 0.6 },
  labelSm: { fontSize: 11 },
});