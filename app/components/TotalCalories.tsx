import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TotalCaloriesProps {
	totalCalories: number;
	dailyCalorieGoal: number;
}

const TotalCalories: React.FC<TotalCaloriesProps> = ({ totalCalories, dailyCalorieGoal }) => {
	const remainingCalories = dailyCalorieGoal - totalCalories;

	return (
		<View style={styles.totalCaloriesContainer}>
			<Text style={styles.totalCaloriesText}>Calories Consumed Today: {totalCalories}</Text>
			<Text
				style={[
					styles.remainingCaloriesText,
					remainingCalories >= 0 ? styles.remainingPositive : styles.remainingNegative,
				]}
			>
				{remainingCalories >= 0
					? `Calories Remaining: ${remainingCalories}`
					: `Over the Goal by: ${-remainingCalories} Calories`}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	totalCaloriesContainer: {
		marginTop: 20,
		alignItems: "center",
	},
	totalCaloriesText: {
		fontSize: 18,
		fontWeight: "bold",
	},
	remainingCaloriesText: {
		fontSize: 16,
	},
	remainingPositive: {
		color: "green",
	},
	remainingNegative: {
		color: "red",
	},
});

export default TotalCalories;
