import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootTabs() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'orange',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
                borderTopWidth: 0,
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

            <Tabs.Screen name='screens/AddList' options={{href: null}}/>
             <Tabs.Screen name='screens/AddReminder' options={{href: null}}/>
            <Tabs.Screen name='screens/AddTask' options={{href: null}}/>
            <Tabs.Screen name='screens/DetailsList' options={{href: null}}/>
            <Tabs.Screen name='screens/UpdateList' options={{href: null}}/>
            <Tabs.Screen name='screens/TaskDetails' options={{href: null}}/>
        </Tabs>
    )
}