// STUB: Replace with MapView from react-native-maps
// once a native development build is confirmed.
// This placeholder exists to allow the overlay UI
// to be built and tested without native dependencies.

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../theme";

export interface MapPlaceholderProps {
  style?: ViewStyle | ViewStyle[];
}

/**
 * A styled placeholder View for the map background.
 * Uses the mapPlaceholder colour token to simulate a map area.
 */
export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ style }): React.JSX.Element => {
  return (
    <View style={[styles.container, style]}>
      {/* Route Line Placeholder */}
      <View style={styles.routeLine} />
      
      {/* Done Marker Placeholder */}
      <View style={[styles.marker, styles.markerDone]} />
      
      {/* GPS Dot Placeholder */}
      <View style={styles.gpsContainer}>
        <View style={styles.gpsHalo} />
        <View style={styles.gpsDot} />
      </View>
      
      {/* Pending Marker Placeholder */}
      <View style={[styles.marker, styles.markerPending]} />
      
      {/* Skipped Marker Placeholder */}
      <View style={[styles.marker, styles.markerSkipped]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mapPlaceholder,
    overflow: "hidden",
  },
  // Rough visual approximate of map elements for placeholder
  routeLine: {
    position: "absolute",
    top: "30%",
    left: "30%",
    width: "40%",
    height: "20%",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    opacity: 0.3,
  },
  marker: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: theme.borders.radiusFull,
    alignItems: "center",
    justifyContent: "center",
  },
  markerDone: {
    top: "30%",
    left: "20%",
    backgroundColor: theme.colors.primary,
  },
  markerPending: {
    top: "25%",
    left: "70%",
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  markerSkipped: {
    top: "15%",
    left: "80%",
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  gpsContainer: {
    position: "absolute",
    top: "45%",
    left: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  gpsHalo: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: theme.borders.radiusFull,
    backgroundColor: theme.colors.gpsBlueHalo,
  },
  gpsDot: {
    width: 12,
    height: 12,
    borderRadius: theme.borders.radiusFull,
    backgroundColor: theme.colors.gpsBlue,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
});
