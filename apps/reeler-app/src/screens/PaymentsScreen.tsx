// SCREEN: Payments
// REFERENCE: Reference_images/Reeler App/7._payments/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { PaymentStatusBadge } from "@silk-value/ui";
import { MOCK_PAYMENT_HISTORY, MOCK_PENDING_BALANCE } from "../mock/reelerMockData";
import { PaymentRecord } from "../types";

export const PaymentsScreen: React.FC = () => {

  const renderItem = ({ item }: { item: PaymentRecord }) => (
    <View style={styles.txnCard}>
      <View style={styles.txnTopRow}>
        <View>
          <Text style={styles.txnDate}>{item.date}</Text>
          <Text style={styles.txnRef}>Ref: {item.referenceNumber}</Text>
        </View>
        <View style={styles.txnAmountCol}>
          <Text style={styles.txnAmount}>
            ₹{item.amount.toLocaleString("en-IN")}
          </Text>
          <PaymentStatusBadge
            status={item.status === "successful" ? "paid" : item.status}
          />
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>PENDING BALANCE</Text>
        <Text style={styles.summaryAmount}>
          ₹{MOCK_PENDING_BALANCE.toLocaleString("en-IN")}
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Month</Text>
          <Text style={styles.filterChipArrow}>▾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Year</Text>
          <Text style={styles.filterChipArrow}>▾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterIconChip}>
          <Text style={styles.filterIconText}>☰</Text>
          <Text style={styles.filterChipText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions Header */}
      <View style={styles.txnHeader}>
        <Text style={styles.txnHeaderText}>TRANSACTIONS</Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.downloadSection}>
      <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
        <Text style={styles.downloadIcon}>⤓</Text>
        <Text style={styles.downloadLabel}>Download Statement</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💳</Text>
      <Text style={styles.emptyText}>No transactions yet</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.topBar}>
        <View style={styles.backPlaceholder} />
        <Text style={styles.topBarTitle}>Payments</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <FlatList
        data={MOCK_PAYMENT_HISTORY}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backPlaceholder: {
    width: 40,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  summarySection: {
    paddingHorizontal: 0,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 4,
  },
  filterSection: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  filterChipArrow: {
    fontSize: 12,
    color: "#64748B",
  },
  filterIconChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginLeft: "auto",
  },
  filterIconText: {
    fontSize: 14,
    color: "#334155",
  },
  txnHeader: {
    paddingVertical: 16,
  },
  txnHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  txnCard: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
  },
  txnTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  txnDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  txnRef: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  txnAmountCol: {
    alignItems: "flex-end",
    gap: 6,
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  downloadSection: {
    paddingVertical: 32,
  },
  downloadButton: {
    flexDirection: "row",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  downloadIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  downloadLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
