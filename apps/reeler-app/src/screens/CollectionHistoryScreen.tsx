// SCREEN: Collection History
// REFERENCE: Reference_images/Reeler App/5._collection_history/screen.png
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CollectionHistoryCard } from "@silk-value/ui";
import { AppStackParamList } from "../navigation/types";
import { MOCK_COLLECTION_HISTORY } from "../mock/reelerMockData";
import { CollectionRecord } from "../types";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const CollectionHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleCollectionPress = (collectionId: string) => {
    navigation.navigate("CollectionDetail", { collectionId });
  };

  const renderItem = ({ item }: { item: CollectionRecord }) => (
    <CollectionHistoryCard
      date={item.date}
      qualityGrade={item.qualityGrade}
      netWeight={item.netWeight}
      paymentStatus={item.paymentStatus}
      onPress={() => handleCollectionPress(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.filtersSection}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search collections</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Date</Text>
          <Text style={styles.filterArrow}>▾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Status</Text>
          <Text style={styles.filterArrow}>▾</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyText}>No collections yet</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation */}
      <View style={styles.topBar}>
        <View style={styles.backPlaceholder} />
        <Text style={styles.topBarTitle}>Collection History</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <FlatList
        data={MOCK_COLLECTION_HISTORY}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={renderHeader}
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
    borderBottomColor: "#F1F5F9",
  },
  backPlaceholder: {
    width: 40,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
    textAlign: "center",
  },
  filtersSection: {
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#64748B",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  filterArrow: {
    fontSize: 14,
    color: "#64748B",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 8,
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
