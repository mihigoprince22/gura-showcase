import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';

interface Props {
  insight: 'good' | 'fair' | 'high';
  message: string;
}

export default function PriceIntelligenceWidget({ insight, message }: Props) {
  let badgeColor = Colors.slateTint;
  let textColor = Colors.slate;
  let label = 'Fair Price';

  if (insight === 'good') {
    badgeColor = '#D1FAE5'; // Light green
    textColor = Colors.malachite;
    label = 'Great Price';
  } else if (insight === 'fair') {
    badgeColor = '#FEF3C7'; // Light yellow
    textColor = Colors.savannaGold;
  } else if (insight === 'high') {
    badgeColor = '#FEE2E2'; // Light red
    textColor = '#E02424';
    label = 'Above Average';
  }

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    marginVertical: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  badgeText: {
    fontFamily: FontFamilies.heading,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  message: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
  }
});
