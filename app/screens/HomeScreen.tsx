import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import CountdownTimer from "../components/CountdownTimer";
import CalorieInput from "../components/CalorieInput";
import TotalCalories from "../components/TotalCalories";

export default function HomeScreen({ navigation }: { navigation: any }) {
	const [totalCalories, setTotalCalories] = useState<number>(0);
	const [nextAllowedTime, setNextAllowedTime] = useState<Date | null>(null);

	const handleSave = (calories: number, nextTime: Date) => {
		setTotalCalories(calories);
		setNextAllowedTime(nextTime);
	};

	return (
		<View style={styles.container}>
			<CountdownTimer nextAllowedTime={nextAllowedTime} />
			<CalorieInput onSave={handleSave} navigation={navigation} />
			<TotalCalories totalCalories={totalCalories} />
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
