import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const mealTypes: {
	name: string;
	icons: { [key: string]: { name: string; package: string } };
}[] = [
	{
		name: "Breakfast",
		icons: {
			Small: { name: "cafe", package: "Ionicons" },
			Medium: { name: "egg", package: "FontAwesome5" },
			Large: { name: "bacon", package: "FontAwesome5" },
		},
	},
	{
		name: "Snack",
		icons: {
			Small: { name: "apple-alt", package: "FontAwesome5" },
			Medium: { name: "ice-cream", package: "Ionicons" },
			Large: { name: "cake", package: "Entypo" },
		},
	},
	{
		name: "Lunch",
		icons: {
			Small: { name: "carrot", package: "FontAwesome5" },
			Medium: { name: "bowl", package: "Entypo" },
			Large: { name: "pizza", package: "Ionicons" },
		},
	},
	{
		name: "Dinner",
		icons: {
			Small: { name: "fish", package: "Ionicons" },
			Medium: { name: "food-steak", package: "MaterialCommunityIcons" },
			Large: { name: "fast-food", package: "Ionicons" },
		},
	},
];
const mealSizes = ["Small", "Medium", "Large"];

interface MealGridProps {
	onSelectMeal: (type: string, size: string, icon: { name: string; package: string }) => void;
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
								onPress={() => onSelectMeal(type.name, size, type.icons[size])}
							>
								{type.icons[size].package === "Ionicons" && (
									<Ionicons
										name={type.icons[size].name as keyof typeof Ionicons.glyphMap}
										size={32}
										color="#007AFF"
									/>
								)}
								{type.icons[size].package === "FontAwesome5" && (
									<FontAwesome5
										name={type.icons[size].name as keyof typeof FontAwesome5.glyphMap}
										size={32}
										color="#007AFF"
									/>
								)}
								{type.icons[size].package === "Entypo" && (
									<Entypo
										name={type.icons[size].name as keyof typeof Entypo.glyphMap}
										size={32}
										color="#007AFF"
									/>
								)}
								{type.icons[size].package === "MaterialCommunityIcons" && (
									<MaterialCommunityIcons
										name={type.icons[size].name as keyof typeof MaterialCommunityIcons.glyphMap}
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
