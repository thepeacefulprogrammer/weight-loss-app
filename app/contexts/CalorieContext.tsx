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
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

export const CalorieProvider = ({ children }: { children: ReactNode }) => {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [nextAllowedTime, setNextAllowedTime] = useState<Date | null>(null);

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

	const addEntry = async (entry: Entry) => {
		try {
			const updatedEntries = [...entries, entry];
			await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
			setEntries(updatedEntries);
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
				addEntry,
				deleteEntry,
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
