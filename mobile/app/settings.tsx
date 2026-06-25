import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import Svg, { Path } from 'react-native-svg';

function ChevronRight({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [outbidAlerts, setOutbidAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [messages, setMessages] = useState(true);
  const [priceDrops, setPriceDrops] = useState(false);
  const [language, setLanguage] = useState('English');

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerStyle: { backgroundColor: Colors.warmLinen },
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: FontFamilies.heading, fontSize: 20 },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 16 }}>
              <Text style={{ fontSize: 22, color: Colors.obsidian }}>←</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <SectionCard title="Preferences">
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Language</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{language}</Text>
              <ChevronRight color={Colors.slate} size={20} />
            </View>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Notifications">
          <View style={styles.row}>
            <Text style={styles.rowText}>Outbid Alerts</Text>
            <Switch
              value={outbidAlerts}
              onValueChange={setOutbidAlerts}
              trackColor={{ false: Colors.slateTint, true: Colors.guraOrange }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Order Updates</Text>
            <Switch
              value={orderUpdates}
              onValueChange={setOrderUpdates}
              trackColor={{ false: Colors.slateTint, true: Colors.guraOrange }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Messages</Text>
            <Switch
              value={messages}
              onValueChange={setMessages}
              trackColor={{ false: Colors.slateTint, true: Colors.guraOrange }}
            />
          </View>
          <View style={[styles.row, styles.lastRow]}>
            <Text style={styles.rowText}>Price Drops</Text>
            <Switch
              value={priceDrops}
              onValueChange={setPriceDrops}
              trackColor={{ false: Colors.slateTint, true: Colors.guraOrange }}
            />
          </View>
        </SectionCard>

        <SectionCard title="Account Details">
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Saved Addresses</Text>
            <ChevronRight color={Colors.slate} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.lastRow]}>
            <Text style={styles.rowText}>Payment Methods</Text>
            <ChevronRight color={Colors.slate} size={20} />
          </TouchableOpacity>
        </SectionCard>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.returnButton} 
            onPress={() => router.replace('/(tabs)/profile')}
          >
            <Text style={styles.returnButtonText}>Return to Profile</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Gura v1.0.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.obsidian,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.warmLinen,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowText: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.obsidian,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.slate,
    marginRight: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    opacity: 0.6,
  },
  returnButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.guraOrange,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  returnButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.guraOrange,
  },
});
