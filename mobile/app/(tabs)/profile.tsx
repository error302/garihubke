import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/auth';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0] || user?.email?.[0] || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>❤️ Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🔍 Saved Searches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>💬 Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🚗 My Listings</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', padding: 24, backgroundColor: '#fff', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  menu: { backgroundColor: '#fff' },
  menuItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 16 },
  logoutButton: { margin: 16, padding: 16, backgroundColor: '#dc2626', borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
