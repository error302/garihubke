import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../services/api';
import { Vehicle } from '../../types';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    try {
      const res = await api.get(`/listings?id=${id}`);
      if (res.data.length > 0) setVehicle(res.data[0]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleContact = () => {
    if (vehicle?.sellerPhone || vehicle?.sellerPhone) {
      Linking.openURL(`tel:${vehicle.sellerPhone}`);
    } else {
      Alert.alert('Error', 'No phone number available');
    }
  };

  if (loading) return <View style={styles.loader}><Text>Loading...</Text></View>;
  if (!vehicle) return <View style={styles.loader}><Text>Vehicle not found</Text></View>;

  const images = JSON.parse(vehicle.images || '[]');

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {images.length > 0 ? images.map((img: string, i: number) => (
          <Image key={i} source={{ uri: img }} style={styles.image} />
        )) : (
          <Image source={{ uri: 'https://via.placeholder.com/400x300' }} style={styles.image} />
        )}
      </ScrollView>
      
      <View style={styles.content}>
        <Text style={styles.title}>{vehicle.title}</Text>
        <Text style={styles.price}>KES {vehicle.price.toLocaleString()}</Text>
        
        <View style={styles.specs}>
          <Text style={styles.specItem}>📅 {vehicle.year}</Text>
          <Text style={styles.specItem}>⛽ {vehicle.fuelType}</Text>
          <Text style={styles.specItem}>⚙️ {vehicle.transmission}</Text>
          {vehicle.mileage && <Text style={styles.specItem}>🛣️ {vehicle.mileage.toLocaleString()} km</Text>}
        </View>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{vehicle.description}</Text>
        
        <Text style={styles.sectionTitle}>Seller</Text>
        <View style={styles.sellerCard}>
          <Text style={styles.sellerName}>{vehicle.sellerName}</Text>
          <Text style={styles.sellerLocation}>📍 {vehicle.sellerLocation}</Text>
        </View>
        
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.contactButtonText}>📞 Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: 400, height: 300, resizeMode: 'cover' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginBottom: 12 },
  specs: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  specItem: { fontSize: 14, color: '#666', marginRight: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  description: { fontSize: 14, color: '#444', lineHeight: 20 },
  sellerCard: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 },
  sellerName: { fontSize: 16, fontWeight: '600' },
  sellerLocation: { fontSize: 14, color: '#666', marginTop: 4 },
  contactButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  contactButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
