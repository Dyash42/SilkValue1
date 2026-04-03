// SCREEN: Language Selection / Splash
// REFERENCE: Reference_images/Reeler App/1._splash_language_selection/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "@silk-value/ui";
import { AuthStackParamList } from "../navigation/types";
import { MOCK_LANGUAGES } from "../mock/reelerMockData";
import { LanguageOption } from "../types";

type Props = NativeStackScreenProps<AuthStackParamList, "LanguageSelection">;

export const LanguageSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const handleContinue = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoGlyph}>◇</Text>
          </View>
          <Text style={styles.appTitle}>SILK VALUE</Text>
          <Text style={styles.appSubtitle}>PREMIUM QUALITY</Text>
        </View>

        {/* Visual Element — silk fabric placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>✦ SILK ✦</Text>
          </View>
        </View>

        {/* Language Selection Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Select Language</Text>
          <Text style={styles.headerSubtitle}>
            Choose your preferred language to continue
          </Text>
        </View>

        {/* Language Buttons */}
        <View style={styles.languageList}>
          {MOCK_LANGUAGES.map((lang: LanguageOption) => {
            const isSelected = lang.code === selectedLanguage;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  isSelected && styles.languageButtonSelected,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.languageLabel,
                    isSelected && styles.languageLabelSelected,
                  ]}
                >
                  {lang.nativeLabel}
                </Text>
                {isSelected && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spacer for bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueLabel}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 24,
  },
  logoIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#000000",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoGlyph: {
    fontSize: 36,
    color: "#FFFFFF",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
    letterSpacing: 4,
    marginTop: 6,
    textTransform: "uppercase",
  },
  imageContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: "#E8E8E8",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 18,
    color: "#999999",
    letterSpacing: 4,
    fontWeight: "500",
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
    marginTop: 4,
  },
  languageList: {
    paddingHorizontal: 24,
    gap: 10,
  },
  languageButton: {
    height: 56,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.15)",
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  languageButtonSelected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  languageLabelSelected: {
    color: "#FFFFFF",
  },
  checkIcon: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 40,
  },
  bottomBar: {
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  continueButton: {
    height: 52,
    backgroundColor: "#000000",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  continueLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
