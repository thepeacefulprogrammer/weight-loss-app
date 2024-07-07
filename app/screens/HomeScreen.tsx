import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import CountdownTimer from "../components/CountdownTimer";
import CalorieInput from "../components/CalorieInput";
import TotalCalories from "../components/TotalCalories";
import { useCalorieContext } from "../contexts/CalorieContext";

export default function HomeScreen({ navigation }: { navigation: any }) {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<CountdownTimer />
			<CalorieInput navigation={navigation} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "#f9f9f9",
	},
});
