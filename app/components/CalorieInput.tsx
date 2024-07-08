import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { useCalorieContext } from "../contexts/CalorieContext";
import MealGrid from "./MealGrid";
import CountdownTimer from "./CountdownTimer";
export default function CalorieInput({ navigation }: { navigation: any }) {
	const { addEntry } = useCalorieContext() as { addEntry: (entry: any) => void };

	const handleMealSelection = (
		type: string,
		size: string,
		icon: { name: string; package: string }
	) => {
		const now = new Date();
		const newEntry = { type, size, icon, time: now.toISOString() };
		addEntry(newEntry);
		Alert.alert("Meal Added", `Added ${size} ${type}`);
	};

	return (
		<View>
			<MealGrid onSelectMeal={handleMealSelection} />
			<CountdownTimer />
			<Button title="View Log" onPress={() => navigation.navigate("Log")} />
		</View>
	);
}

const styles = StyleSheet.create({
	// You can add any additional styles here if needed
});
