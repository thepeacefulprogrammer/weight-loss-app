import React from "react";
import { View, StyleSheet } from "react-native";
import CountdownTimer from "../components/CountdownTimer";
import CalorieInput from "../components/CalorieInput";
import TotalCalories from "../components/TotalCalories";
import { useCalorieContext } from "../contexts/CalorieContext";

export default function HomeScreen({ navigation }: { navigation: any }) {
	const { totalCalories, dailyCalorieGoal } = useCalorieContext();

	return (
		<View style={styles.container}>
			<CountdownTimer />
			<CalorieInput navigation={navigation} />
			<TotalCalories totalCalories={totalCalories} dailyCalorieGoal={dailyCalorieGoal} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "#f9f9f9",
	},
});
