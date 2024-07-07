import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface CountdownTimerProps {
	nextAllowedTime: Date | null;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextAllowedTime = null }) => {
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
		backgroundColor: "#ffeb3b",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	countdownText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "red",
	},
});

export default CountdownTimer;
