import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CalorieProvider } from "./contexts/CalorieContext";
import HomeScreen from "./screens/HomeScreen";
import LogScreen from "./screens/LogScreen";

const Stack = createStackNavigator();

export default function App() {
	return (
		<CalorieProvider>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Log" component={LogScreen} />
			</Stack.Navigator>
		</CalorieProvider>
	);
}
