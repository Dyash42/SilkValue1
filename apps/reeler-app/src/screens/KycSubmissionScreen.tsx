// SCREEN: KYC Submission
// REFERENCE: Reference_images/Reeler App/3._kyc_submission/screen.png
// STATUS: UI Complete — Mock Data Only
// TODO: Replace mock data with WatermelonDB observables
//   when data integration phase begins.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "KycSubmission">;

export const KycSubmissionScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [village, setVillage] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [ifsc, setIfsc] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    navigation.navigate("AccountStatus");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>KYC Submission</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="As per Aadhaar/PAN"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.flex]}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#94A3B8"
                    value={dob}
                    onChangeText={setDob}
                  />
                  <Text style={styles.inputIcon}>📅</Text>
                </View>
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <TouchableOpacity style={styles.select}>
                  <Text style={styles.selectText}>{gender}</Text>
                  <Text style={styles.selectArrow}>▾</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Residential Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Residential Address</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Village / Street</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter village or street name"
                placeholderTextColor="#94A3B8"
                value={village}
                onChangeText={setVillage}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>District</Text>
                <TextInput
                  style={styles.input}
                  placeholder="District"
                  placeholderTextColor="#94A3B8"
                  value={district}
                  onChangeText={setDistrict}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#94A3B8"
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Document Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Verification</Text>
          <View style={styles.docGrid}>
            <TouchableOpacity style={styles.docButton}>
              <Text style={styles.docIcon}>📤</Text>
              <Text style={styles.docLabel}>UPLOAD AADHAAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.docButton}>
              <Text style={styles.docIcon}>🪪</Text>
              <Text style={styles.docLabel}>UPLOAD PAN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.docButton}>
              <Text style={styles.docIcon}>📸</Text>
              <Text style={styles.docLabel}>LIVE SELFIE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.docButton}>
              <Text style={styles.docIcon}>📍</Text>
              <Text style={styles.docLabel}>CAPTURE GPS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                placeholderTextColor="#94A3B8"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>IFSC Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="IFSC0001234"
                  placeholderTextColor="#94A3B8"
                  value={ifsc}
                  onChangeText={setIfsc}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Bank Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Bank Name"
                  placeholderTextColor="#94A3B8"
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Consent */}
        <View style={styles.consentRow}>
          <TouchableOpacity
            style={[styles.checkbox, consent && styles.checkboxChecked]}
            onPress={() => setConsent(!consent)}
          >
            {consent && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.consentText}>
            I agree to share my data and documents for the purpose of KYC
            verification and account setup. I confirm all details provided are
            true and correct.
          </Text>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitLabel}>REVIEW & SUBMIT</Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 28,
    color: "#000000",
    fontWeight: "700",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  fieldGroup: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
  },
  flex: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    paddingRight: 12,
  },
  inputIcon: {
    fontSize: 18,
    color: "#94A3B8",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfField: {
    flex: 1,
    gap: 8,
  },
  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    color: "#000000",
  },
  selectArrow: {
    fontSize: 16,
    color: "#94A3B8",
  },
  docGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  docButton: {
    width: "47%",
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  docIcon: {
    fontSize: 24,
  },
  docLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  consentRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  submitSection: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  submitButton: {
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});
