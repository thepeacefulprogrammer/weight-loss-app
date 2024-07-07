import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Entry {
	calories: string;
	time: string;
}

export default function LogScreen() {
	const [entries, setEntries] = useState<Entry[]>([]);

	useEffect(() => {
		const loadEntries = async () => {
			try {
				const storedEntries = JSON.parse((await AsyncStorage.getItem("entries")) || "[]");
				setEntries(storedEntries);
			} catch (error) {
				console.error("Error loading entries:", error);
			}
		};
		loadEntries();
	}, []);

	const deleteEntry = async (index: number) => {
		Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						const updatedEntries = entries.filter((_, i) => i !== index);
						await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
						setEntries(updatedEntries);
					} catch (error) {
						console.error("Error deleting entry:", error);
					}
				},
			},
		]);
	};

	const renderItem = ({ item, index }: { item: Entry; index: number }) => (
		<View style={styles.item}>
			<Text>Calories: {item.calories}</Text>
			<Text>Time: {new Date(item.time).toLocaleString()}</Text>
			<Button title="Delete" onPress={() => deleteEntry(index)} color="red" />
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={entries}
				renderItem={renderItem}
				keyExtractor={(_, index) => index.toString()}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	item: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
