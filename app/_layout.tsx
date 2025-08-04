import { Stack } from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { notificationService } from "@/services/notificationService";
import { useEffect } from "react";

export default function RootLayout() {
  
  useEffect(() => {
    // Inicializar sistema de notificaciones simple
    notificationService.initialize();
    
    // Limpiar al desmontar
    return () => {
      notificationService.cleanup();
    };
  }, []);

  return (
      <SafeAreaProvider>
        <Stack screenOptions={{headerShown: false,}}>
            <Stack.Screen
            name="tabs"
            options={{
                title: 'NoteDo',
            }}/>
        </Stack>
      </SafeAreaProvider>
  );
}
