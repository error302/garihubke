# Phase 5C: Mobile App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React Native Expo mobile app sharing the existing Next.js API backend, providing vehicle listings, search, import calculator, messaging, and sell features.

**Architecture:** React Native Expo app in `/mobile` directory, uses existing REST API endpoints, shares authentication, same database.

**Tech Stack:** Expo SDK 52, React Native 0.76, React Navigation, Axios, AsyncStorage

---

## File Structure

| File | Purpose |
|------|---------|
| `mobile/app.json` | Expo configuration |
| `mobile/package.json` | Dependencies |
| `mobile/app/_layout.tsx` | Root layout with providers |
| `mobile/app/(auth)/login.tsx` | Login screen |
| `mobile/app/(auth)/register.tsx` | Register screen |
| `mobile/app/(tabs)/_layout.tsx` | Tab navigator |
| `mobile/app/(tabs)/index.tsx` | Home/Listings |
| `mobile/app/(tabs)/calculator.tsx` | Import calculator |
| `mobile/app/(tabs)/sell.tsx` | Sell a car |
| `mobile/app/(tabs)/profile.tsx` | User profile |
| `mobile/app/vehicle/[id].tsx` | Vehicle detail |
| `mobile/components/VehicleCard.tsx` | Vehicle list item |
| `mobile/components/FilterModal.tsx` | Search filters |
| `mobile/services/api.ts` | API client |
| `mobile/services/auth.ts` | Auth helpers |
| `mobile/types/index.ts` | TypeScript types |

---

## Tasks

### Task 1: Initialize Expo Project

**Files:**
- Create: `mobile/package.json`
- Create: `mobile/app.json`
- Create: `mobile/tsconfig.json`

- [ ] **Step 1: Create mobile/package.json**

```json
{
  "name": "garihubke-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "~4.4.0",
    "react-native-safe-area-context": "4.12.0",
    "axios": "^1.6.0",
    "@react-native-async-storage/async-storage": "1.23.1",
    "expo-image-picker": "~16.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.3.0"
  }
}
```

- [ ] **Step 2: Create mobile/app.json**

```json
{
  "expo": {
    "name": "GariHub",
    "slug": "garihubke-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "garihubke",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563eb"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "co.garihubke.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2563eb"
      },
      "package": "co.garihubke.app"
    },
    "plugins": ["expo-router"]
  }
}
```

- [ ] **Step 3: Create tsconfig.json for mobile**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 4: Create directory structure**

```bash
mkdir -p mobile/app/\(auth\) mobile/app/\(tabs\) mobile/app/vehicle mobile/components mobile/services mobile/types mobile/assets
```

- [ ] **Step 5: Commit**

```bash
git add mobile/
git commit -m "feat: initialize Expo mobile app project"
```

---

### Task 2: API and Auth Services

**Files:**
- Create: `mobile/services/api.ts`
- Create: `mobile/services/auth.ts`
- Create: `mobile/types/index.ts`

- [ ] **Step 1: Create mobile/types/index.ts**

```typescript
export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType: string;
  transmission: string;
  description: string;
  features?: string;
  images: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
  category: string;
  status: string;
  seller: {
    name: string;
    phone: string;
    location: string;
    county?: string;
    city?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

- [ ] **Step 2: Create mobile/services/api.ts**

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

- [ ] **Step 3: Create mobile/services/auth.ts**

```typescript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post('/auth/callback/credentials', { email, password });
    if (res.data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      await AsyncStorage.setItem('token', res.data.token || 'logged_in');
    }
    return res.data;
  },

  async register(name: string, email: string, password: string) {
    const res = await api.post('/register', { name, email, password });
    return res.data;
  },

  async logout() {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  },

  async getUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async isLoggedIn() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add mobile/services mobile/types
git commit -m "feat: add API and auth services for mobile app"
```

---

### Task 3: Root Layout and Auth Stack

**Files:**
- Create: `mobile/app/_layout.tsx`
- Create: `mobile/app/(auth)/_layout.tsx`
- Create: `mobile/app/(auth)/login.tsx`
- Create: `mobile/app/(auth)/register.tsx`

- [ ] **Step 1: Create mobile/app/_layout.tsx**

```tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.isLoggedIn().then(setIsLoggedIn).finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name("(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
```

- [ ] **Step 2: Create mobile/app/(auth)/_layout.tsx**

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
```

- [ ] **Step 3: Create mobile/app/(auth)/login.tsx**

```tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await authService.login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#2563eb', marginTop: 16, textAlign: 'center', fontSize: 14 },
});
```

- [ ] **Step 4: Create mobile/app/(auth)/register.tsx**

```tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await authService.register(name, email, password);
      Alert.alert('Success', 'Account created! Please sign in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join GariHub today</Text>
      
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#2563eb', marginTop: 16, textAlign: 'center', fontSize: 14 },
});
```

- [ ] **Step 5: Commit**

```bash
git add mobile/app/\(auth\)
git commit -m "feat: add auth screens (login/register)"
```

---

### Task 4: Tab Navigation and Home Screen

**Files:**
- Create: `mobile/app/(tabs)/_layout.tsx`
- Create: `mobile/app/(tabs)/index.tsx`
- Create: `mobile/components/VehicleCard.tsx`

- [ ] **Step 1: Create mobile/app/(tabs)/_layout.tsx**

```tsx
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: () => <Text>🧮</Text>,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarIcon: () => <Text>🚗</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 2: Create mobile/components/VehicleCard.tsx**

```tsx
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
```

- [ ] **Step 3: Create mobile/app/(tabs)/index.tsx**

```tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add mobile/app/\(tabs\) mobile/components
git commit -m "feat: add tab navigation and home screen"
```

---

### Task 5: Vehicle Detail Screen

**Files:**
- Create: `mobile/app/vehicle/[id].tsx`

- [ ] **Step 1: Create mobile/app/vehicle/[id].tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add mobile/app/vehicle/\[id\].tsx
git commit -m "feat: add vehicle detail screen"
```

---

### Task 6: Calculator Screen

**Files:**
- Create: `mobile/app/(tabs)/calculator.tsx`

- [ ] **Step 1: Create mobile/app/(tabs)/calculator.tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add mobile/app/\(tabs\)/calculator.tsx
git commit -m "feat: add import calculator screen"
```

---

### Task 7: Sell and Profile Screens

**Files:**
- Create: `mobile/app/(tabs)/sell.tsx`
- Create: `mobile/app/(tabs)/profile.tsx`

- [ ] **Step 1: Create mobile/app/(tabs)/sell.tsx**

```tsx
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
```

- [ ] **Step 2: Create mobile/app/(tabs)/profile.tsx**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add mobile/app/\(tabs\)/sell.tsx mobile/app/\(tabs\)/profile.tsx
git commit -m "feat: add sell and profile screens"
```

---

### Task 8: Build and Test

**Files:**
- Modify: Various

- [ ] **Step 1: Install dependencies**

```bash
cd mobile && npm install
```

- [ ] **Step 2: Generate assets**

```bash
# Create placeholder assets
touch mobile/assets/icon.png mobile/assets/splash.png mobile/assets/adaptive-icon.png
```

- [ ] **Step 3: Verify project structure**

- [ ] **Step 4: Commit**

```bash
git add mobile/
git commit -m "feat: complete mobile app MVP"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Initialize Expo project |
| 2 | API and auth services |
| 3 | Root layout and auth screens |
| 4 | Tab navigation and home screen |
| 5 | Vehicle detail screen |
| 6 | Calculator screen |
| 7 | Sell and profile screens |
| 8 | Build and test |
