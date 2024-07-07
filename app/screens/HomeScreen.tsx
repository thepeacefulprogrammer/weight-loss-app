import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function HomeScreen({ navigation }: { navigation: any }) {
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
			const newEntry = { calories: caloriesNumber, time: time.toISOString() };
			try {
				const existingEntries = JSON.parse((await AsyncStorage.getItem("entries")) || "[]");
				existingEntries.push(newEntry);
				await AsyncStorage.setItem("entries", JSON.stringify(existingEntries));
				setCalories("");
				setTime(new Date());
			} catch (error) {
				console.error("Error saving entry:", error);
			}
		} else {
			Alert.alert("Error", "Please select a time.");
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
			<Text>Select Time:</Text>
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
	dateButton: {
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 12,
	},
});
