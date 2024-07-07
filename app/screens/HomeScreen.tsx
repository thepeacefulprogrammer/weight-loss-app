import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Entry {
	calories: string;
	time: string;
}

export default function HomeScreen({ navigation }: { navigation: any }) {
	const [calories, setCalories] = useState<string>("");
	const [time, setTime] = useState<Date | null>(new Date());
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [totalCalories, setTotalCalories] = useState<number>(0);

	useEffect(() => {
		const calculateTotalCalories = async () => {
			try {
				const storedEntries = JSON.parse(
					(await AsyncStorage.getItem("entries")) || "[]"
				) as Entry[];
				const today = new Date();
				const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
				const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
				const todayEntries = storedEntries.filter((entry) => {
					const entryTime = new Date(entry.time);
					return entryTime >= startOfDay && entryTime < endOfDay;
				});
				const total = todayEntries.reduce((sum, entry) => sum + Number(entry.calories), 0);
				setTotalCalories(total);
			} catch (error) {
				console.error("Error calculating total calories:", error);
			}
		};

		calculateTotalCalories();
	}, []);

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date: Date) => {
		setTime(date);
		hideDatePicker();
	};

	const saveEntry = async () => {
		if (!calories) {
			Alert.alert("Error", "Please enter the number of calories.");
			return;
		}

		const caloriesNumber = Number(calories);
		if (isNaN(caloriesNumber) || caloriesNumber <= 0) {
			Alert.alert("Error", "Please enter a valid number of calories.");
			return;
		}

		if (time) {
			const newEntry = { calories: caloriesNumber.toString(), time: time.toISOString() };
			try {
				const existingEntries = JSON.parse(
					(await AsyncStorage.getItem("entries")) || "[]"
				) as Entry[];
				existingEntries.push(newEntry);
				await AsyncStorage.setItem("entries", JSON.stringify(existingEntries));
				setCalories("");
				setTime(new Date());
				// Recalculate total calories after adding new entry
				const startOfDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
				const endOfDay = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1);
				const todayEntries = existingEntries.filter((entry) => {
					const entryTime = new Date(entry.time);
					return entryTime >= startOfDay && entryTime < endOfDay;
				});
				const total = todayEntries.reduce((sum, entry) => sum + Number(entry.calories), 0);
				setTotalCalories(total);
			} catch (error) {
				console.error("Error saving entry:", error);
			}
		} else {
			Alert.alert("Error", "Please select a time.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Enter Calories:</Text>
			<TextInput
				style={styles.input}
				value={calories}
				onChangeText={setCalories}
				keyboardType="numeric"
			/>
			<Text style={styles.label}>Select Time:</Text>
			<TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
				<Text>{time ? time.toLocaleString() : "Select Time"}</Text>
			</TouchableOpacity>
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="datetime"
				date={time || new Date()}
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
			<View style={styles.buttonContainer}>
				<Button title="Save Entry" onPress={saveEntry} />
				<Button title="View Log" onPress={() => navigation.navigate("Log")} />
			</View>
			<View style={styles.totalCaloriesContainer}>
				<Text style={styles.totalCaloriesText}>Calories Consumed Today: {totalCalories}</Text>
			</View>
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
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
	},
	dateButton: {
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
		backgroundColor: "#fff",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	totalCaloriesContainer: {
		marginTop: 20,
		alignItems: "center",
	},
	totalCaloriesText: {
		fontSize: 18,
		fontWeight: "bold",
	},
});
