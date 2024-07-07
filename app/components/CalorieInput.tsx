import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Entry {
	calories: string;
	time: string;
}

interface CalorieInputProps {
	onSave: (totalCalories: number, nextAllowedTime: Date) => void;
	navigation: any;
}

const CalorieInput: React.FC<CalorieInputProps> = ({ onSave, navigation }) => {
	const [calories, setCalories] = useState<string>("");
	const [time, setTime] = useState<Date | null>(new Date());
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
			const newEntry: Entry = { calories: caloriesNumber.toString(), time: time.toISOString() };
			try {
				const existingEntries: Entry[] = JSON.parse(
					(await AsyncStorage.getItem("entries")) || "[]"
				);
				existingEntries.push(newEntry);
				await AsyncStorage.setItem("entries", JSON.stringify(existingEntries));
				setCalories("");
				setTime(new Date());

				// Recalculate total calories after adding new entry
				const today = new Date();
				const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
				const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
				const todayEntries = existingEntries.filter((entry: Entry) => {
					const entryTime = new Date(entry.time);
					return entryTime >= startOfDay && entryTime < endOfDay;
				});
				const total = todayEntries.reduce(
					(sum: number, entry: Entry) => sum + Number(entry.calories),
					0
				);

				// Set next allowed eating time
				const nextTime = new Date(time.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to current time

				onSave(total, nextTime);
			} catch (error) {
				console.error("Error saving entry:", error);
			}
		} else {
			Alert.alert("Error", "Please select a time.");
		}
	};

	return (
		<View>
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
		</View>
	);
};

const styles = StyleSheet.create({
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
});

export default CalorieInput;
