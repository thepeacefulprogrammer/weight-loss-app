import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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

	const renderItem = ({ item }: { item: Entry }) => (
		<View style={styles.item}>
			<Text>Calories: {item.calories}</Text>
			<Text>Time: {new Date(item.time).toLocaleString()}</Text>
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
	},
});
