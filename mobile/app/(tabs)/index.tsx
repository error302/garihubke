import { useState, useEffect } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import api from '../../services/api';
import VehicleCard from '../../components/VehicleCard';
import { Vehicle } from '../../types';

export default function HomeScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await api.get('/listings');
      setVehicles(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.make.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GariHub</Text>
        <TextInput
          style={styles.search}
          placeholder="Search vehicles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => router.push(`/vehicle/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  search: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16 },
  list: { padding: 16 },
  loader: { flex: 1, justifyContent: 'center' },
});
