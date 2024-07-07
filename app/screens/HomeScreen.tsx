import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: { navigation: any }) {
	const [calories, setCalories] = useState<string>("");
	const [time, setTime] = useState<string>("");

	const saveEntry = async () => {
		const newEntry = { calories, time: new Date(time).toISOString() };
		try {
			const existingEntries = JSON.parse((await AsyncStorage.getItem("entries")) || "[]");
			existingEntries.push(newEntry);
			await AsyncStorage.setItem("entries", JSON.stringify(existingEntries));
			setCalories("");
			setTime("");
		} catch (error) {
			console.error("Error saving entry:", error);
		}
	};

	return (
		<View style={styles.container}>
			<Text>Enter Calories:</Text>
			<TextInput
				style={styles.input}
				value={calories}
				onChangeText={setCalories}
				keyboardType="numeric"
			/>
			<Text>Enter Time:</Text>
			<TextInput
				style={styles.input}
				value={time}
				onChangeText={setTime}
				placeholder="YYYY-MM-DD HH:MM"
			/>
			<Button title="Save Entry" onPress={saveEntry} />
			<Button title="View Log" onPress={() => navigation.navigate("Log")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
	},
});
