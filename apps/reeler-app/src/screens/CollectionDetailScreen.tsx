// SCREEN: Collection Detail
// REFERENCE: Reference_images/Reeler App/6._collection_detail/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/types";
import { MOCK_COLLECTION_HISTORY } from "../mock/reelerMockData";

type Props = NativeStackScreenProps<AppStackParamList, "CollectionDetail">;

export const CollectionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { collectionId } = route.params;
  const collection = MOCK_COLLECTION_HISTORY.find((c) => c.id === collectionId) ||
    MOCK_COLLECTION_HISTORY[0];

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Collection Detail</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket Information */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TICKET INFORMATION</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ticket ID</Text>
              <Text style={styles.infoValue}>{collection.ticketId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date/Time</Text>
              <Text style={styles.infoValue}>{collection.date} • 10:30 AM</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Collector</Text>
              <Text style={styles.infoValue}>{collection.collectorName}</Text>
            </View>
          </View>
        </View>

        {/* Weight Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>WEIGHT DETAILS</Text>
          <View style={styles.weightGrid}>
            <View style={styles.weightCard}>
              <Text style={styles.weightLabel}>Field Weight</Text>
              <Text style={styles.weightValue}>
                {collection.fieldWeight.toLocaleString()} kg
              </Text>
            </View>
            <View style={styles.weightCard}>
              <Text style={styles.weightLabel}>Factory Weight</Text>
              <Text style={styles.weightValue}>
                {collection.factoryWeight.toLocaleString()} kg
              </Text>
            </View>
          </View>
          <View style={styles.varianceRow}>
            <Text style={styles.varianceLabel}>Variance</Text>
            <Text style={styles.varianceValue}>
              {collection.variancePercent}% ({collection.varianceKg} kg)
            </Text>
          </View>
        </View>

        {/* Quality Grade */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>QUALITY GRADE</Text>
          <View style={styles.gradeCard}>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeLetter}>
                {collection.qualityGrade === "Premium" ? "A+" : collection.qualityGrade === "Standard" ? "B" : "A"}
              </Text>
            </View>
            <View>
              <Text style={styles.gradeTitle}>
                {collection.qualityGrade} Grade
              </Text>
              <Text style={styles.gradeSubtitle}>
                Moisture Content: {collection.moistureContent}%
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PAYMENT BREAKDOWN</Text>
          <View style={styles.paymentList}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Base Rate (per kg)</Text>
              <Text style={styles.paymentValue}>
                ₹{collection.baseRatePerKg.toFixed(2)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Gross Amount</Text>
              <Text style={styles.paymentValue}>
                ₹{collection.grossAmount.toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.deductionLabel}>Quality Deductions</Text>
              <Text style={styles.deductionValue}>
                -₹{collection.qualityDeductions.toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.netPayableRow}>
              <Text style={styles.netPayableLabel}>Net Payable</Text>
              <Text style={styles.netPayableValue}>
                ₹{collection.netPayable.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* Status & UTR */}
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>PAYMENT STATUS</Text>
              <View
                style={[
                  styles.statusBadge,
                  collection.paymentStatus === "paid"
                    ? styles.statusCompleted
                    : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    collection.paymentStatus === "paid"
                      ? styles.statusCompletedText
                      : styles.statusPendingText,
                  ]}
                >
                  {collection.paymentStatus === "paid" ? "COMPLETED" : "PENDING"}
                </Text>
              </View>
            </View>
            {collection.paymentUtr ? (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>UTR NUMBER</Text>
                <Text style={styles.utrValue}>{collection.paymentUtr}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 26,
    color: "#000000",
    fontWeight: "500",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 32,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(0,0,0,0.4)",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  infoList: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  weightGrid: {
    flexDirection: "row",
    gap: 16,
  },
  weightCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.04)",
    padding: 16,
    borderRadius: 8,
  },
  weightLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  varianceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 8,
  },
  varianceLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  varianceValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  gradeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#000000",
    padding: 20,
    borderRadius: 12,
  },
  gradeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradeLetter: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  gradeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
  },
  gradeSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  paymentList: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  deductionLabel: {
    fontSize: 14,
    color: "#DC2626",
  },
  deductionValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DC2626",
  },
  netPayableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#000000",
  },
  netPayableLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  netPayableValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  statusCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 12,
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  statusCompleted: {
    backgroundColor: "#DCFCE7",
  },
  statusPending: {
    backgroundColor: "#000000",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusCompletedText: {
    color: "#15803D",
  },
  statusPendingText: {
    color: "#FFFFFF",
  },
  utrValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "monospace",
    letterSpacing: -0.5,
  },
});
