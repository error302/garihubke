import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual'];

export default function SellScreen() {
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', price: '', mileage: '',
    fuelType: 'Petrol', transmission: 'Automatic', description: '',
    sellerName: '', sellerPhone: '', sellerLocation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.make || !form.price) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/listings', { ...form, category: 'cars', images: '[]', features: '[]' });
      Alert.alert('Success', 'Listing created!', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create listing');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sell Your Car</Text>
      
      <TextInput style={styles.input} placeholder="Title *" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
      <TextInput style={styles.input} placeholder="Make *" value={form.make} onChangeText={(v) => setForm({ ...form, make: v })} />
      <TextInput style={styles.input} placeholder="Model" value={form.model} onChangeText={(v) => setForm({ ...form, model: v })} />
      <TextInput style={styles.input} placeholder="Year *" value={form.year} onChangeText={(v) => setForm({ ...form, year: v })} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Price (KES) *" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Mileage (km)" value={form.mileage} onChangeText={(v) => setForm({ ...form, mileage: v })} keyboardType="numeric" />
      
      <Text style={styles.label}>Fuel Type</Text>
      <View style={styles.options}>
        {FUEL_TYPES.map((fuel) => (
          <TouchableOpacity key={fuel} style={[styles.option, form.fuelType === fuel && styles.optionSelected]} onPress={() => setForm({ ...form, fuelType: fuel })}>
            <Text style={[styles.optionText, form.fuelType === fuel && styles.optionTextSelected]}>{fuel}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.label}>Transmission</Text>
      <View style={styles.options}>
        {TRANSMISSIONS.map((trans) => (
          <TouchableOpacity key={trans} style={[styles.option, form.transmission === trans && styles.optionSelected]} onPress={() => setForm({ ...form, transmission: trans })}>
            <Text style={[styles.optionText, form.transmission === trans && styles.optionTextSelected]}>{trans}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline numberOfLines={4} />
      <TextInput style={styles.input} placeholder="Your Name" value={form.sellerName} onChangeText={(v) => setForm({ ...form, sellerName: v })} />
      <TextInput style={styles.input} placeholder="Phone" value={form.sellerPhone} onChangeText={(v) => setForm({ ...form, sellerPhone: v })} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Location" value={form.sellerLocation} onChangeText={(v) => setForm({ ...form, sellerLocation: v })} />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Post Listing'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  option: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', marginRight: 8, marginBottom: 8 },
  optionSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  optionText: { fontSize: 14 },
  optionTextSelected: { color: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
