import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Entry {
	type: string;
	size: string;
	icon: { name: string; package: string };
	time: string;
}

interface CalorieContextType {
	entries: Entry[];
	addEntry: (entry: Entry) => void;
	deleteEntry: (index: number) => void;
	nextAllowedTime: Date | null;
	nextMealType: string | null;
}

const CalorieContext = createContext<CalorieContextType | null>(null);

export const useCalorieContext = () => {
	const context = useContext(CalorieContext);
	if (context === null) {
		throw new Error("useCalorieContext must be used within a CalorieProvider");
	}
	return context;
};

export const CalorieProvider = ({ children }: { children: ReactNode }) => {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [nextAllowedTime, setNextAllowedTime] = useState<Date | null>(null);
	const [nextMealType, setNextMealType] = useState<string | null>(null);

	useEffect(() => {
		const loadEntries = async () => {
			try {
				const storedEntries = JSON.parse(
					(await AsyncStorage.getItem("entries")) || "[]"
				) as Entry[];
				setEntries(storedEntries);
				if (storedEntries.length > 0) {
					const lastEntryTime = new Date(storedEntries[storedEntries.length - 1].time);
					const nextTime = new Date(lastEntryTime.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to last entry time
					setNextAllowedTime(nextTime);
				}
			} catch (error) {
				console.error("Error loading entries:", error);
			}
		};
		loadEntries();
	}, []);

	const calculateNextMealTime = (entries: Entry[]): { time: Date; type: string } => {
		const now = new Date();
		const mealTimes = ["Breakfast", "Snack", "Lunch", "Snack", "Dinner"];
		const lastEntry = entries[entries.length - 1];
		const lastMealIndex = mealTimes.indexOf(lastEntry.type);
		let nextMealIndex = (lastMealIndex + 1) % mealTimes.length;

		// Gradually adjust snack times
		if (lastEntry.type === "Snack") {
			const lastMealTime = new Date(lastEntry.time);
			const timeSinceLastMeal = now.getTime() - lastMealTime.getTime();
			const adjustment = Math.min(timeSinceLastMeal / (1000 * 60 * 60 * 24), 1) * 5 * 60 * 1000; // Adjust by up to 5 minutes per day
			now.setTime(now.getTime() + adjustment);
		}

		// Set next meal time
		const nextMealTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // Default to 3 hours later
		return { time: nextMealTime, type: mealTimes[nextMealIndex] };
	};

	const addEntry = async (entry: Entry) => {
		try {
			const updatedEntries = [...entries, entry];
			await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
			setEntries(updatedEntries);
			const { time, type } = calculateNextMealTime(updatedEntries);
			setNextAllowedTime(time);
			setNextMealType(type);
		} catch (error) {
			console.error("Error adding entry:", error);
		}
	};

	const deleteEntry = async (index: number) => {
		try {
			const updatedEntries = entries.filter((_, i) => i !== index);
			await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
			setEntries(updatedEntries);
			if (updatedEntries.length > 0) {
				const lastEntryTime = new Date(updatedEntries[updatedEntries.length - 1].time);
				const nextTime = new Date(lastEntryTime.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to last entry time
				setNextAllowedTime(nextTime);
			} else {
				setNextAllowedTime(null);
			}
		} catch (error) {
			console.error("Error deleting entry:", error);
		}
	};

	return (
		<CalorieContext.Provider
			value={{
				entries: entries,
				addEntry: addEntry,
				deleteEntry: deleteEntry,
				nextAllowedTime: nextAllowedTime,
				nextMealType,
			}}
		>
			{children}
		</CalorieContext.Provider>
	);
};
