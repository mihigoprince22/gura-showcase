import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

// Icons
function ChevronRight({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ color, size, filled }: { color: string; size: number, filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BadgeIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88M12 21.5V20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user: authUser, logout } = useAuthStore();
  const [localName, setLocalName] = useState('Mihigo Prince');
  const [localDistrict, setLocalDistrict] = useState('Kicukiro');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(localName);
  const [editDistrict, setEditDistrict] = useState(localDistrict);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await api.get<any>('/users/me');
      return res.data;
    },
  });

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon key={i} size={16} color={Colors.guraOrange} filled={i <= Math.round(rating)} />
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.guraOrange} />
      </SafeAreaView>
    );
  }

  const displayName = localName;
  const initial = displayName.charAt(0).toUpperCase();
  const district = localDistrict;
  const tier = user?.seller_tier;
  const rating = Number(user?.aggregate_rating || user?.seller_rating || 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Profile Info */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.location}>{district}, Rwanda</Text>
          
          <View style={[styles.badgeContainer, { backgroundColor: '#E8F5E9' }]}>
            <BadgeIcon color="#00E676" size={16} />
            <Text style={[styles.badgeText, { color: '#00E676' }]}>
              ID Verified
            </Text>
          </View>

          {rating > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
              {renderStars(rating)}
              <Text style={styles.ratingCount}>({user?.review_count || 0})</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
        </View>

        {/* Action Menu */}
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setEditName(localName); setEditDistrict(localDistrict); setIsEditModalVisible(true); }}>
            <Text style={styles.menuText}>Edit Profile</Text>
            <ChevronRight color={Colors.slate} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <Text style={styles.menuText}>Settings</Text>
            <ChevronRight color={Colors.slate} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/watchlist')}>
            <Text style={styles.menuText}>Watchlist</Text>
            <ChevronRight color={Colors.slate} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={() => router.push('/saved-searches')}>
            <Text style={styles.menuText}>Saved Searches</Text>
            <ChevronRight color={Colors.slate} size={20} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={isEditModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput 
              style={styles.input} 
              value={editName} 
              onChangeText={setEditName} 
            />
            
            <Text style={styles.inputLabel}>Location (District)</Text>
            <TextInput 
              style={styles.input} 
              value={editDistrict} 
              onChangeText={setEditDistrict} 
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={() => {
                setLocalName(editName);
                setLocalDistrict(editDistrict);
                setIsEditModalVisible(false);
              }}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.warmLinen,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.guraOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: FontFamilies.heading,
    fontSize: 36,
    color: Colors.white,
  },
  name: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: Colors.obsidian,
    marginBottom: 4,
  },
  location: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 12,
    color: Colors.guraOrange,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.obsidian,
    marginRight: 6,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingCount: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamilies.heading,
    fontSize: 24,
    color: Colors.obsidian,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.slateTint,
    marginHorizontal: 16,
  },
  menuGroup: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.obsidian,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 14, 23, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.obsidian,
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.slate,
    marginBottom: 8,
  },
  input: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.obsidian,
    borderWidth: 1,
    borderColor: Colors.slateTint,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalCancel: {
    padding: 12,
  },
  modalCancelText: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.slate,
  },
  modalSave: {
    backgroundColor: Colors.guraOrange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSaveText: {
    fontFamily: FontFamilies.body,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.white,
  },
});
