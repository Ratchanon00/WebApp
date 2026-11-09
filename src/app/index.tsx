import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import AssetBars from "../../components/AssetBars";
import EventTable from "../../components/EventTable";
import FactoryScene from "../../components/FactoryScene";
import KpiCards from "../../components/KpiCards";
import MachineDetail from "../../components/MachineDetail";
import MachineList from "../../components/MachineList";
import type { ViewKey } from "../../components/Nav";
import { Sidebar, TabBar } from "../../components/Nav";
import { C, STATUS, T } from "../../components/theme";
import TopBar from "../../components/TopBar";
import TrendChart from "../../components/TrendChart";
import type { Status } from "../../hooks/useFactoryData";
import { useFactoryData } from "../../hooks/useFactoryData";

const TITLES: Record<ViewKey, { title: string; sub: string }> = {
  dashboard: { title: "Dashboard Overview", sub: "Fleet condition at a glance" },
  assets: { title: "Assets", sub: "Live condition of each monitored asset" },
  events: { title: "Event Log", sub: "Threshold violations recorded this session" },
};

export default function Home() {
  const { machines, alerts } = useFactoryData();
  const [selectedId, setSelectedId] = useState("m1");
  const [view, setView] = useState<ViewKey>("dashboard");
  const [query, setQuery] = useState("");
  const { width } = useWindowDimensions();

  const wide = width >= 900;
  const showScene = Platform.OS === "web";
  const topPad =
    Platform.OS === "android"
      ? (StatusBar.currentHeight ?? 24) + 12
      : Platform.OS === "ios"
      ? 56
      : 20;

  const selected = machines.find((m) => m.id === selectedId)!;
  if (!selected.latest) {
    return (
      <View style={s.loading}>
        <Text style={s.loadingText}>Connecting to data source…</Text>
      </View>
    );
  }

  const warn = machines.filter((m) => m.latest?.status === "warning").length;
  const crit = machines.filter((m) => m.latest?.status === "critical").length;
  const level: Status = crit ? "critical" : warn ? "warning" : "normal";
  const st = STATUS[level];
  const pill =
    level === "normal"
      ? "All assets normal"
      : level === "warning"
      ? `${warn} ${warn === 1 ? "asset" : "assets"} in warning`
      : `${crit} ${crit === 1 ? "asset" : "assets"} critical`;

  const q = query.trim().toLowerCase();
  const visibleAssets = machines.filter((m) => !q || m.name.toLowerCase().includes(q));

  const scene = showScene ? (
    <FactoryScene machines={machines} selectedId={selectedId} onSelect={setSelectedId} />
  ) : null;
  const list = (
    <MachineList machines={visibleAssets} selectedId={selectedId} onSelect={setSelectedId} />
  );
  const detail = <MachineDetail machine={selected} />;

  let body: React.ReactNode;
  if (view === "dashboard") {
    body = wide ? (
      <View style={s.gridWide}>
        <View style={s.colMain}>
          <TrendChart machines={machines} />
          <AssetBars machines={machines} />
        </View>
        <View style={s.colSide}>
          <KpiCards machines={machines} />
          <EventTable alerts={alerts} query={query} limit={6} />
        </View>
      </View>
    ) : (
      <View style={s.stack}>
        <KpiCards machines={machines} />
        <TrendChart machines={machines} />
        <AssetBars machines={machines} />
        <EventTable alerts={alerts} query={query} compact limit={5} />
      </View>
    );
  } else if (view === "assets") {
    body = wide ? (
      <View style={s.gridWide}>
        <View style={s.colMain}>
          {scene}
          {detail}
        </View>
        <View style={s.colSide}>{list}</View>
      </View>
    ) : (
      <View style={s.stack}>
        {scene}
        {list}
        {detail}
      </View>
    );
  } else {
    body = (
      <EventTable
        alerts={alerts}
        query={query}
        compact={!wide}
        limit={50}
        title="All Events"
      />
    );
  }

  return (
    <View style={[s.root, wide && s.rootWide]}>
      <StatusBar barStyle="dark-content" />
      {wide && <Sidebar view={view} onChange={setView} />}

      <View style={s.main}>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={[s.content, { paddingTop: topPad }]}
        >
          <TopBar
            query={query}
            onQuery={setQuery}
            level={level}
            onBell={() => setView("events")}
            narrow={!wide}
          />

          <View style={s.pageHead}>
            <View style={{ flex: 1, minWidth: 200 }}>
              <Text style={T.h1}>{TITLES[view].title}</Text>
              <Text style={T.sub}>{TITLES[view].sub}</Text>
            </View>
            <View style={[s.pill, { backgroundColor: st.soft }]}>
              <Text style={[s.pillText, { color: st.color }]}>
                {st.icon} {pill}
              </Text>
            </View>
          </View>

          {body}
        </ScrollView>

        {!wide && <TabBar view={view} onChange={setView} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  rootWide: { flexDirection: "row" },
  main: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 18,
    maxWidth: 1400,
    width: "100%",
    alignSelf: "center",
  },
  loading: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
  loadingText: { color: C.muted, fontSize: 16 },
  pageHead: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  pillText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.3 },
  stack: { gap: 16 },
  gridWide: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
  colMain: { flex: 3, gap: 16 },
  colSide: { flex: 2, gap: 16 },
});