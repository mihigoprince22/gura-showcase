import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import GuraButton from '../brand/GuraButton';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterDrawer({ visible, onClose, onApply }: FilterDrawerProps) {
  const [condition, setCondition] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);

  const handleApply = () => {
    onApply({ condition, listing_format: format });
    onClose();
  };

  const handleClear = () => {
    setCondition(null);
    setFormat(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.chipRow}>
              {['new', 'like_new', 'good', 'fair'].map(cond => (
                <TouchableOpacity 
                  key={cond} 
                  style={[styles.chip, condition === cond && styles.chipActive]}
                  onPress={() => setCondition(condition === cond ? null : cond)}
                >
                  <Text style={[styles.chipText, condition === cond && styles.chipTextActive]}>
                    {cond.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Format</Text>
            <View style={styles.chipRow}>
              {['fixed_price', 'auction'].map(fmt => (
                <TouchableOpacity 
                  key={fmt} 
                  style={[styles.chip, format === fmt && styles.chipActive]}
                  onPress={() => setFormat(format === fmt ? null : fmt)}
                >
                  <Text style={[styles.chipText, format === fmt && styles.chipTextActive]}>
                    {fmt.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
            <View style={styles.applyBtnWrap}>
              <GuraButton label="Apply" onPress={handleApply} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 14, 23, 0.4)', // Midnight Ink semi-transparent
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: Colors.warmLinen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.midnightInk,
  },
  closeText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.midnightInk,
    marginBottom: 12,
    marginTop: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: Colors.midnightInk,
    borderColor: Colors.midnightInk,
  },
  chipText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
  },
  clearBtn: {
    marginRight: 24,
  },
  clearText: {
    fontFamily: FontFamilies.body,
    color: Colors.slate,
    textDecorationLine: 'underline',
  },
  applyBtnWrap: {
    flex: 1,
  }
});
