import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TotalCaloriesProps {
	totalCalories: number;
}

const TotalCalories: React.FC<TotalCaloriesProps> = ({ totalCalories }) => {
	return (
		<View style={styles.totalCaloriesContainer}>
			<Text style={styles.totalCaloriesText}>Calories Consumed Today: {totalCalories}</Text>
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
});

export default TotalCalories;
