import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LogScreen from "./screens/LogScreen";

const Stack = createStackNavigator();

function App() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Log" component={LogScreen} />
		</Stack.Navigator>
	);
}

export default function Index() {
	return <App />;
}
