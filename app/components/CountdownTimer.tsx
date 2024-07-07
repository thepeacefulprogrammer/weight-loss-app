import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCalorieContext } from "../contexts/CalorieContext";

const CountdownTimer: React.FC = () => {
	const { nextAllowedTime } = useCalorieContext();
	const [countdown, setCountdown] = useState<string>("");

	useEffect(() => {
		const interval = setInterval(() => {
			if (nextAllowedTime) {
				const now = new Date().getTime();
				const timeDifference = nextAllowedTime.getTime() - now;
				if (timeDifference > 0) {
					const hours = Math.floor(timeDifference / (1000 * 60 * 60));
					const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
					setCountdown(`${hours}h ${minutes}m ${seconds}s`);
				} else {
					setCountdown("You can eat now!");
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [nextAllowedTime]);

	return (
		<View style={styles.countdownContainer}>
			<Text style={styles.countdownText}>{countdown}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	countdownContainer: {
		marginBottom: 20,
		alignItems: "center",
		padding: 10,
		backgroundColor: "#fff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	countdownText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#007AFF",
	},
});

export default CountdownTimer;
