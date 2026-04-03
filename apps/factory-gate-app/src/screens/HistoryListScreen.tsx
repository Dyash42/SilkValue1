// ─── Screen 8: History List — Searchable vehicle entry log ───────────────────
// TODO: Replace with WatermelonDB query and pagination.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MOCK_HISTORY } from "../mock/gateMockData";

export const HistoryListScreen: React.FC<any> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("Today");
  const entries = MOCK_HISTORY;

  const statusIcon: Record<string, string> = {
    accepted: "✓",
    deducted: "⚠",
    rejected: "✕",
  };
  const statusColor: Record<string, string> = {
    accepted: "#22C55E",
    deducted: "#F59E0B",
    rejected: "#EF4444",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.factoryIcon}>🏭</Text>
          <Text style={styles.topBarTitle}>FACTORY LOGISTICS</Text>
        </View>
        <Text style={styles.topBarRight}>HISTORY</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Vehicle ID, collector, cluster"
            placeholderTextColor="#888888"
          />
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {["Today", "This Week", "Custom Date"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                activeFilter === filter ? styles.filterPillActive : styles.filterPillInactive,
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === filter ? styles.filterPillTextActive : null,
                ]}
              >
                {filter.toUpperCase()}
              </Text>
              {filter === "Custom Date" && <Text style={styles.calendarIcon}>📅</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <Text style={styles.resultsLabel}>
          SHOWING {entries.length} ENTRIES
        </Text>

        {/* Entry Cards */}
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.entryCard}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate?.("HistoryDetail", { entryId: entry.id })}
          >
            <View style={styles.entryTopRow}>
              <Text style={styles.entryVehicleId}>{entry.vehicleId}</Text>
              <Text style={styles.entryTimestamp}>{entry.timestamp}</Text>
            </View>
            <View style={styles.entryMiddleRow}>
              <Text style={styles.entryCollector}>{entry.collectorName}</Text>
              <Text style={styles.entryCluster}>{entry.cluster}</Text>
            </View>
            <View style={styles.entryBottomRow}>
              <View>
                <Text style={styles.entryWeightLabel}>NET WEIGHT</Text>
                <Text style={styles.entryWeightValue}>
                  {entry.netWeight.toLocaleString()} KG
                </Text>
              </View>
              <View style={styles.entryStatusBadge}>
                <Text style={[styles.entryStatusIcon, { color: statusColor[entry.status] }]}>
                  {statusIcon[entry.status]}
                </Text>
                <Text style={styles.entryStatusText}>
                  {entry.status === "deducted" ? "DEDUCTED" : entry.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: {
    height: 64, backgroundColor: "#FFFFFF",
    borderBottomWidth: 1, borderBottomColor: "#000000",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  factoryIcon: { fontSize: 20 },
  topBarTitle: { fontSize: 22, fontWeight: "700", color: "#000000", letterSpacing: -1, textTransform: "uppercase" },
  topBarRight: { fontSize: 14, fontWeight: "700", color: "#000000", textTransform: "uppercase" },
  content: { padding: 16, paddingBottom: 32, gap: 16 },

  // Search
  searchContainer: { flexDirection: "row", alignItems: "center", height: 48, borderWidth: 1, borderColor: "#000000", backgroundColor: "#FFFFFF", borderRadius: 2, paddingHorizontal: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: "400", color: "#000000" },

  // Filters
  filterRow: { flexGrow: 0, marginBottom: 4 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 2, marginRight: 8, flexDirection: "row", alignItems: "center", gap: 4 },
  filterPillActive: { backgroundColor: "#000000" },
  filterPillInactive: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000" },
  filterPillText: { fontSize: 11, fontWeight: "700", color: "#000000", letterSpacing: 1, textTransform: "uppercase" },
  filterPillTextActive: { color: "#FFFFFF" },
  calendarIcon: { fontSize: 14 },

  // Results
  resultsLabel: { fontSize: 11, fontWeight: "700", color: "#474747", letterSpacing: 0.8, textTransform: "uppercase" },

  // Entry Card
  entryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  entryTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  entryVehicleId: { fontSize: 18, fontWeight: "700", color: "#000000" },
  entryTimestamp: { fontSize: 11, fontWeight: "500", color: "#474747" },
  entryMiddleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  entryCollector: { fontSize: 13, color: "#474747" },
  entryCluster: { fontSize: 13, fontWeight: "700", color: "#474747", letterSpacing: -0.5, textTransform: "uppercase" },
  entryBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderTopWidth: 1, borderTopColor: "#C6C6C6", paddingTop: 12 },
  entryWeightLabel: { fontSize: 10, fontWeight: "700", color: "#474747", textTransform: "uppercase" },
  entryWeightValue: { fontSize: 20, fontWeight: "700", color: "#000000" },
  entryStatusBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#000000", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 2 },
  entryStatusIcon: { fontSize: 12 },
  entryStatusText: { fontSize: 10, fontWeight: "700", color: "#FFFFFF", letterSpacing: 1, textTransform: "uppercase" },
});
