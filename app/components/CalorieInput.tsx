import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { useCalorieContext } from "../contexts/CalorieContext";
import MealGrid from "./MealGrid";

const mealCalories = {
	Breakfast: { Small: 300, Medium: 500, Large: 700 },
	Snack: { Small: 100, Medium: 200, Large: 300 },
	Lunch: { Small: 400, Medium: 600, Large: 800 },
	Dinner: { Small: 400, Medium: 600, Large: 800 },
};

export default function CalorieInput({ navigation }: { navigation: any }) {
	const { addEntry, nextAllowedTime } = useCalorieContext();

	const handleMealSelection = (type: string, size: string) => {
		const now = new Date();

		const calories =
			mealCalories[type as keyof typeof mealCalories][size as keyof typeof mealCalories.Breakfast];
		const newEntry = { calories: calories.toString(), time: now.toISOString() };
		addEntry(newEntry);
		Alert.alert("Meal Added", `Added ${size} ${type} (${calories} calories)`);
	};

	return (
		<View>
			<MealGrid onSelectMeal={handleMealSelection} />
			<Button title="View Log" onPress={() => navigation.navigate("Log")} />
		</View>
	);
}

const styles = StyleSheet.create({
	// You can add any additional styles here if needed
});
