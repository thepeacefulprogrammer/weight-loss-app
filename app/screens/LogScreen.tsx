import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
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
			<View style={styles.itemTextContainer}>
				<Text style={styles.itemText}>Calories: {item.calories}</Text>
				<Text style={styles.itemText}>Time: {new Date(item.time).toLocaleString()}</Text>
			</View>
			<TouchableOpacity onPress={() => deleteEntry(index)} style={styles.deleteButton}>
				<Text style={styles.deleteButtonText}>DELETE</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={entries}
				renderItem={renderItem}
				keyExtractor={(_, index) => index.toString()}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f9f9f9",
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#ffffff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	itemTextContainer: {
		flex: 1,
	},
	itemText: {
		fontSize: 16,
		color: "#333",
	},
	deleteButton: {
		backgroundColor: "#ff3b30",
		padding: 10,
		borderRadius: 8,
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	separator: {
		height: 10,
	},
});
