import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function RootTabs() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'orange',
            tabBarInactiveTintColor: 'white',

            tabBarStyle: {
                backgroundColor: '#000'
            },
        }}>
            <Tabs.Screen
              name='Home'
              options={{
                  tabBarIcon: ({ color, size }) =>  <Ionicons name='home' color={color} size={size} />,
              }}
            />

            <Tabs.Screen
                name='Papeleria'
                options={{
                    tabBarIcon: ({ color, size }) =>  <Ionicons name='trash' color={color} size={size} />,
                }}
            />
        </Tabs>
    )
}