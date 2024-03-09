import { useEffect, useState } from "react";

export function useTypewriterEffect(
	text: string,
	speedInterval: number,
	callBack?: Function
)  {
	const [textDisplay, setTextDisplay] = useState("");

	useEffect(() => {
		const textArray = text.split("");
		let currentIndex = 0;

		const interval = setInterval(() => {
			if (currentIndex < textArray.length) {
				setTextDisplay((prevText) => {
					const updatedText = prevText + textArray[currentIndex];
					currentIndex++;
					return updatedText;
				});
			} else {
				callBack?.();
				clearInterval(interval);
			}
		}, speedInterval);

		return () => clearInterval(interval); // Cleanup on unmount or text change
	}, []);

	return textDisplay;
}

type TypewriterComponentProps = {
	text: string;
	speedInterval?: number;
	callback?: Function;
};

export function TypewriterComponent({ text, speedInterval = 80, callback }: TypewriterComponentProps) {
	const textDisplay = useTypewriterEffect(text, speedInterval, callback);

	return textDisplay
}
