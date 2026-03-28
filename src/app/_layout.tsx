import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Imagery' }} />
      <Stack.Screen name="gallery/[source]" options={{ title: '' }} />
      <Stack.Screen
        name="viewer/[startIndex]"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
