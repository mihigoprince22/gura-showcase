import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/colors";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { DISTRICTS, getDistrictsByProvince, type District } from "@/constants/districts";

interface DistrictSelectorProps {
  value: string;
  onSelect: (district: string) => void;
  label?: string;
  error?: string;
}

export default function DistrictSelector({
  value,
  onSelect,
  label = "District",
  error,
}: DistrictSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const districtsByProvince = getDistrictsByProvince();

  const sections: { title: string; data: District[] }[] = Object.keys(
    districtsByProvince
  ).map((province) => ({
    title: province,
    data: districtsByProvince[province],
  }));

  const flatData: ({ type: "header"; title: string } | { type: "item"; district: District })[] = [];
  sections.forEach((section) => {
    flatData.push({ type: "header", title: section.title });
    section.data.forEach((district) => {
      flatData.push({ type: "item", district });
    });
  });

  const handleSelect = (districtName: string) => {
    onSelect(districtName);
    setIsOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={[
          styles.selector,
          error ? styles.selectorError : null,
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectorText,
            !value && styles.placeholderText,
          ]}
        >
          {value || "Select a district"}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select District</Text>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={flatData}
            keyExtractor={(item, index) =>
              item.type === "header"
                ? `header-${item.title}`
                : `item-${item.district.name}-${index}`
            }
            renderItem={({ item }) => {
              if (item.type === "header") {
                return (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                      {item.title.toUpperCase()}
                    </Text>
                  </View>
                );
              }
              const isSelected = value === item.district.name;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item.district.name)}
                  style={[
                    styles.districtItem,
                    isSelected && styles.districtItemSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.districtText,
                      isSelected && styles.districtTextSelected,
                    ]}
                  >
                    {item.district.name}
                  </Text>
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.midnightInk,
    marginBottom: 8,
    includeFontPadding: false,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.warmLinen,
    borderWidth: 1.5,
    borderColor: Colors.slateTint,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorError: {
    borderColor: Colors.danger,
  },
  selectorText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.base,
    color: Colors.midnightInk,
    includeFontPadding: false,
    flex: 1,
  },
  placeholderText: {
    color: Colors.slate,
  },
  chevron: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.lg,
    color: Colors.slate,
    marginLeft: 8,
  },
  errorText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.danger,
    marginTop: 6,
    includeFontPadding: false,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  modalTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.xl,
    color: Colors.midnightInk,
    letterSpacing: -1.5,
    includeFontPadding: false,
  },
  closeText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.base,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontFamily: FontFamilies.mono,
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.guraOrange,
    includeFontPadding: false,
  },
  districtItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  districtItemSelected: {
    backgroundColor: Colors.orangeTint,
  },
  districtText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.base,
    color: Colors.midnightInk,
    includeFontPadding: false,
  },
  districtTextSelected: {
    fontFamily: FontFamilies.heading,
    color: Colors.guraOrange,
  },
  checkmark: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.lg,
    color: Colors.guraOrange,
  },
  listContent: {
    paddingBottom: 40,
  },
});
