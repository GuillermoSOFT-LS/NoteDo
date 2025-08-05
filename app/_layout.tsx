import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { notificationService } from "@/services/notificationService";
import { powerModeService } from "@/services/powerModeService";
import { useEffect } from "react";
import { AppState } from "react-native";


export default function RootLayout() {
  
  useEffect(() => {
    // Inicializar sistema de notificaciones
    const initializeNotifications = async () => {
      try {
        const success = await notificationService.initialize();
        if (success) {
          console.log('✅ Sistema de notificaciones inicializado correctamente');
          
          // Verificar modo ahorro de energía después de inicializar
          setTimeout(async () => {
            await powerModeService.checkAndAlertPowerIssues();
          }, 2000); // Esperar 2 segundos para no saturar al usuario
          
        } else {
          console.log('⚠️ Sistema de notificaciones inicializado con limitaciones');
        }
      } catch (error) {
        console.error('❌ Error inicializando notificaciones:', error);
      }
    };
    
    initializeNotifications();
    
    // Manejar cambios de estado de la app (para debug)
    const handleAppStateChange = (nextAppState: string) => {
      console.log(`📱 App state cambió a: ${nextAppState}`);
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Limpiar al desmontar
    return () => {
      subscription.remove();
      if (notificationService.cleanup) {
        notificationService.cleanup();
      }
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
