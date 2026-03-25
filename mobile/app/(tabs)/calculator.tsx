import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export default function CalculatorScreen() {
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    engineCc: '',
    cifPrice: '',
    fuelType: 'Petrol',
  });
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const year = parseInt(form.year);
    const cif = parseFloat(form.cifPrice);
    const cc = parseInt(form.engineCc);
    const age = 2026 - year;
    
    const depreciation = age <= 1 ? 0 : Math.min(0.65, age * 0.08);
    const customsValue = cif * (1 - depreciation);
    
    const importDuty = customsValue * 0.25;
    const exciseRate = form.fuelType === 'Electric' ? 0.10 : cc > 1500 ? 0.25 : 0.20;
    const exciseDuty = (customsValue + importDuty) * exciseRate;
    const vat = (customsValue + importDuty + exciseDuty) * 0.16;
    const idf = customsValue * 0.035;
    const rdl = customsValue * 0.02;
    const portFee = 236000;
    
    const total = customsValue + importDuty + exciseDuty + vat + idf + rdl + portFee;
    
    setResult({
      customsValue,
      importDuty,
      exciseDuty,
      vat,
      idf,
      rdl,
      portFee,
      total,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Import Calculator</Text>
      <Text style={styles.subtitle}>Calculate total landed cost</Text>
      
      <TextInput style={styles.input} placeholder="Make" value={form.make} onChangeText={(v) => setForm({ ...form, make: v })} />
      <TextInput style={styles.input} placeholder="Model" value={form.model} onChangeText={(v) => setForm({ ...form, model: v })} />
      <TextInput style={styles.input} placeholder="Year" value={form.year} onChangeText={(v) => setForm({ ...form, year: v })} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Engine CC" value={form.engineCc} onChangeText={(v) => setForm({ ...form, engineCc: v })} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="CIF Price (KES)" value={form.cifPrice} onChangeText={(v) => setForm({ ...form, cifPrice: v })} keyboardType="numeric" />
      
      <Text style={styles.label}>Fuel Type</Text>
      <View style={styles.options}>
        {FUEL_TYPES.map((fuel) => (
          <TouchableOpacity
            key={fuel}
            style={[styles.option, form.fuelType === fuel && styles.optionSelected]}
            onPress={() => setForm({ ...form, fuelType: fuel })}
          >
            <Text style={[styles.optionText, form.fuelType === fuel && styles.optionTextSelected]}>{fuel}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={calculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      
      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Cost Breakdown</Text>
          <Text style={styles.resultRow}>Customs Value: KES {result.customsValue.toLocaleString()}</Text>
          <Text style={styles.resultRow}>Import Duty (25%): KES {result.importDuty.toLocaleString()}</Text>
          <Text style={styles.resultRow}>Excise Duty: KES {result.exciseDuty.toLocaleString()}</Text>
          <Text style={styles.resultRow}>VAT (16%): KES {result.vat.toLocaleString()}</Text>
          <Text style={styles.resultRow}>IDF (3.5%): KES {result.idf.toLocaleString()}</Text>
          <Text style={styles.resultRow}>RDL (2%): KES {result.rdl.toLocaleString()}</Text>
          <Text style={styles.resultRow}>Port & Clearance: KES {result.portFee.toLocaleString()}</Text>
          <Text style={styles.total}>Total: KES {result.total.toLocaleString()}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  option: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', marginRight: 8, marginBottom: 8 },
  optionSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  optionText: { fontSize: 14 },
  optionTextSelected: { color: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  result: { marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  resultRow: { fontSize: 14, color: '#444', marginBottom: 8 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#2563eb', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#ddd' },
});