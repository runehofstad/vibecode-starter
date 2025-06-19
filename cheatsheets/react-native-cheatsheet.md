# React Native Cheat Sheet

## Project Setup

### Create New App
```bash
# With Expo (Recommended)
npx create-expo-app my-app --template
cd my-app

# With React Native CLI
npx react-native init MyApp --template react-native-template-typescript
```

### Essential Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# State Management
npm install @reduxjs/toolkit react-redux
# OR
npm install zustand

# Forms
npm install react-hook-form

# UI Components
npm install react-native-elements react-native-vector-icons
# OR
npm install react-native-paper

# Async Storage
npx expo install @react-native-async-storage/async-storage

# Secure Storage
npx expo install expo-secure-store
```

## Core Components

### Basic Layout
```tsx
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hello World</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

### Lists
```tsx
import { FlatList, Text, View } from 'react-native';

<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
  onRefresh={handleRefresh}
  refreshing={isRefreshing}
/>
```

### Forms & Input
```tsx
import { TextInput, Button } from 'react-native';

<TextInput
  style={styles.input}
  value={value}
  onChangeText={setValue}
  placeholder="Enter text"
  secureTextEntry={false}
  keyboardType="default"
  autoCapitalize="none"
  autoCorrect={false}
/>

<Button
  title="Submit"
  onPress={handleSubmit}
  color="#007AFF"
/>
```

## Navigation

### Stack Navigator
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Tab Navigator
```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## Platform-Specific Code

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

## Expo-Specific Features

### Camera
```tsx
import { Camera } from 'expo-camera';

const [hasPermission, setHasPermission] = useState(null);

useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);
```

### Location
```tsx
import * as Location from 'expo-location';

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;
  
  let location = await Location.getCurrentPositionAsync({});
  console.log(location);
};
```

### Notifications
```tsx
import * as Notifications from 'expo-notifications';

const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = await Notifications.getExpoPushTokenAsync();
  console.log(token);
};
```

## Styling Best Practices

### Responsive Design
```tsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.5,
  },
});
```

### Theme System
```tsx
const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    text: '#000',
    background: '#F2F2F7',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

## Performance Optimization

### Memoization
```tsx
import React, { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  return <View>{/* Render data */}</View>;
});

const optimizedData = useMemo(() => 
  processData(rawData), [rawData]
);

const handlePress = useCallback(() => {
  // Handle press
}, [dependency]);
```

### List Optimization
```tsx
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={100}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## Debugging

```bash
# Show developer menu
# iOS: Cmd + D
# Android: Cmd + M (macOS) or Ctrl + M (Windows/Linux)

# Remote debugging
# Enable "Debug JS Remotely" from developer menu

# React DevTools
npm install -g react-devtools
react-devtools

# Flipper
# Download from https://fbflipper.com/
```

## Build & Deployment

### Expo Build
```bash
# Configure
eas build:configure

# Build
eas build --platform ios
eas build --platform android
eas build --platform all

# Submit
eas submit --platform ios
eas submit --platform android
```

### React Native CLI Build
```bash
# iOS
cd ios && pod install
npx react-native run-ios --configuration Release

# Android
cd android && ./gradlew assembleRelease
npx react-native run-android --variant=release
```

## Common Issues & Solutions

### Metro Issues
```bash
# Clear cache
npx react-native start --reset-cache
# OR with Expo
npx expo start -c
```

### iOS Pod Issues
```bash
cd ios
pod deintegrate
pod install
```

### Android Build Issues
```bash
cd android
./gradlew clean
./gradlew build
```

## Testing

### Unit Testing
```bash
# Setup
npm install --save-dev @testing-library/react-native

# Run tests
npm test
```

### E2E Testing with Detox
```bash
# Install
npm install --save-dev detox

# Build
detox build --configuration ios

# Test
detox test --configuration ios
```