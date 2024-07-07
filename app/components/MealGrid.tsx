import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const mealTypes = [
	{
		name: "Breakfast",
		icons: {
			Small: { name: "cafe", package: "Ionicons" } as const,
			Medium: { name: "egg", package: "FontAwesome5" } as const,
			Large: { name: "bacon", package: "FontAwesome5" } as const,
		},
	},
	{
		name: "Snack",
		icons: {
			Small: { name: "apple-alt", package: "FontAwesome5" } as const,
			Medium: { name: "ice-cream", package: "Ionicons" } as const,
			Large: { name: "cake", package: "Entypo" } as const,
		},
	},
	{
		name: "Lunch",
		icons: {
			Small: { name: "carrot", package: "FontAwesome5" } as const,
			Medium: { name: "bowl", package: "Entypo" } as const,
			Large: { name: "pizza", package: "Ionicons" } as const,
		},
	},
	{
		name: "Dinner",
		icons: {
			Small: { name: "fish", package: "Ionicons" } as const,
			Medium: { name: "food-steak", package: "MaterialCommunityIcons" } as const,
			Large: { name: "fast-food", package: "Ionicons" } as const,
		},
	},
] as const;
const mealSizes = ["Small", "Medium", "Large"];

interface MealGridProps {
	onSelectMeal: (type: string, size: string) => void;
}

const MealGrid: React.FC<MealGridProps> = ({ onSelectMeal }) => {
	return (
		<View style={styles.container}>
			{mealTypes.map((type) => (
				<View key={type.name} style={styles.card}>
					<Text style={styles.mealTypeText}>{type.name}</Text>
					<View style={styles.sizeContainer}>
						{mealSizes.map((size) => (
							<TouchableOpacity
								key={`${type.name}-${size}`}
								style={styles.mealButton}
								onPress={() => onSelectMeal(type.name, size)}
							>
								{type.icons[size as keyof typeof type.icons].package === "Ionicons" && (
									<Ionicons
										name={type.icons[size as keyof typeof type.icons].name as any}
										size={32}
										color="#007AFF"
									/>
								)}
								{type.icons[size as keyof typeof type.icons].package === "FontAwesome5" && (
									<FontAwesome5
										name={type.icons[size as keyof typeof type.icons].name}
										size={32}
										color="#007AFF"
									/>
								)}
								{type.icons[size as keyof typeof type.icons].package === "Entypo" && (
									<Entypo
										name={type.icons[size as keyof typeof type.icons].name as any}
										size={32}
										color="#007AFF"
									/>
								)}
								{type.icons[size as keyof typeof type.icons].package ===
									"MaterialCommunityIcons" && (
									<MaterialCommunityIcons
										name={type.icons[size as keyof typeof type.icons].name as any}
										size={32}
										color="#007AFF"
									/>
								)}
								<Text style={styles.sizeText}>{size}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	card: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	mealTypeText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	sizeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	mealButton: {
		alignItems: "center",
	},
	sizeText: {
		marginTop: 5,
	},
});

export default MealGrid;
