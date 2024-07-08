import React, { useRef, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons, FontAwesome5, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCalorieContext } from "../contexts/CalorieContext";
import { Swipeable } from "react-native-gesture-handler";

interface Entry {
	type: string;
	size: string;
	icon: { name: string; package: string };
	time: string;
}

const LogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const { entries, deleteEntry } = useCalorieContext();

	const renderIcon = (icon?: { name: string; package: string }) => {
		if (!icon || !icon.package || !icon.name) {
			return <Ionicons name="help-circle-outline" size={32} color="#007AFF" />;
		}

		switch (icon.package) {
			case "Ionicons":
				return <Ionicons name={icon.name as any} size={32} color="#007AFF" />;
			case "FontAwesome5":
				return <FontAwesome5 name={icon.name as any} size={32} color="#007AFF" />;
			case "Entypo":
				return <Entypo name={icon.name as any} size={32} color="#007AFF" />;
			case "MaterialCommunityIcons":
				return <MaterialCommunityIcons name={icon.name as any} size={32} color="#007AFF" />;
			default:
				return <Ionicons name="help-circle-outline" size={32} color="#007AFF" />;
		}
	};

	const renderRightActions = (index: number) => (
		<TouchableOpacity onPress={() => handleDeleteEntry(index)} style={styles.deleteButton}>
			<Ionicons name="trash-outline" size={24} color="#fff" />
		</TouchableOpacity>
	);

	const renderItem = ({ item, index }: { item: Entry; index: number }) => (
		<Swipeable
			ref={(ref) => (swipeableRefs.current[index] = ref)}
			renderRightActions={() => renderRightActions(index)}
			onSwipeableOpen={() => {
				swipeableRefs.current.forEach((ref, idx) => {
					if (idx !== index) ref?.close();
				});
			}}
		>
			<View style={styles.item}>
				<View style={styles.itemTextContainer}>
					<Text style={styles.itemText}>{`${item.size} ${item.type}`}</Text>
					<Text style={styles.itemText}>Time: {new Date(item.time).toLocaleString()}</Text>
				</View>
				{renderIcon(item.icon)}
			</View>
		</Swipeable>
	);

	const handleDeleteEntry = (index: number) => {
		Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					deleteEntry(index);
					closeAllSwipeables();
				},
			},
		]);
	};

	const swipeableRefs = useRef<(Swipeable | null)[]>([]);
	const closeAllSwipeables = useCallback(() => {
		swipeableRefs.current.forEach((ref) => ref?.close());
	}, []);

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
};

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
		justifyContent: "center",
		alignItems: "center",
		width: 80,
		height: "100%",
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 12,
		marginTop: 4,
	},
	separator: {
		height: 10,
	},
});

export default LogScreen;
