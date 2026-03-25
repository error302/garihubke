import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

export default function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const images = JSON.parse(vehicle.images || '[]');
  const imageUrl = images[0] || 'https://via.placeholder.com/300x200';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{vehicle.title}</Text>
        <Text style={styles.price}>KES {vehicle.price.toLocaleString()}</Text>
        <Text style={styles.details}>{vehicle.year} • {vehicle.fuelType} • {vehicle.transmission}</Text>
        <Text style={styles.location}>{vehicle.seller?.location || vehicle.sellerLocation}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  content: { padding: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  details: { fontSize: 13, color: '#666', marginBottom: 2 },
  location: { fontSize: 12, color: '#888' },
});
