import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CalorieProvider } from "./contexts/CalorieContext";
import HomeScreen from "./screens/HomeScreen";
import LogScreen from "./screens/LogScreen";

const Stack = createStackNavigator();

export default function App() {
	return (
		<CalorieProvider>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
				<Stack.Screen name="Log" component={LogScreen} options={{ title: "Log" }} />
			</Stack.Navigator>
		</CalorieProvider>
	);
}
