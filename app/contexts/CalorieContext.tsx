import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Entry {
	calories: string;
	time: string;
}

interface CalorieContextType {
	entries: Entry[];
	totalCalories: number;
	addEntry: (entry: Entry) => void;
	deleteEntry: (index: number) => void;
	dailyCalorieGoal: number;
	setDailyCalorieGoal: (goal: number) => void;
	nextAllowedTime: Date | null;
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

export const CalorieProvider = ({ children }: { children: ReactNode }) => {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [totalCalories, setTotalCalories] = useState<number>(0);
	const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number>(2000); // Default daily calorie goal
	const [nextAllowedTime, setNextAllowedTime] = useState<Date | null>(null);

	useEffect(() => {
		const loadEntries = async () => {
			try {
				const storedEntries = JSON.parse(
					(await AsyncStorage.getItem("entries")) || "[]"
				) as Entry[];
				setEntries(storedEntries);
				calculateTotalCalories(storedEntries);
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

	const calculateTotalCalories = (entries: Entry[]) => {
		const today = new Date();
		const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
		const todayEntries = entries.filter((entry) => {
			const entryTime = new Date(entry.time);
			return entryTime >= startOfDay && entryTime < endOfDay;
		});
		const total = todayEntries.reduce((sum, entry) => sum + Number(entry.calories), 0);
		setTotalCalories(total);
	};

	const addEntry = async (entry: Entry) => {
		try {
			const updatedEntries = [...entries, entry];
			await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
			setEntries(updatedEntries);
			calculateTotalCalories(updatedEntries);
			const nextTime = new Date(new Date(entry.time).getTime() + 3 * 60 * 60 * 1000); // Add 3 hours to current time
			setNextAllowedTime(nextTime);
		} catch (error) {
			console.error("Error adding entry:", error);
		}
	};

	const deleteEntry = async (index: number) => {
		try {
			const updatedEntries = entries.filter((_, i) => i !== index);
			await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
			setEntries(updatedEntries);
			calculateTotalCalories(updatedEntries);
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
				entries,
				totalCalories,
				addEntry,
				deleteEntry,
				dailyCalorieGoal,
				setDailyCalorieGoal,
				nextAllowedTime,
			}}
		>
			{children}
		</CalorieContext.Provider>
	);
};

export const useCalorieContext = () => {
	const context = useContext(CalorieContext);
	if (!context) {
		throw new Error("useCalorieContext must be used within a CalorieProvider");
	}
	return context;
};
