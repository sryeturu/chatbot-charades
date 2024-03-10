"use client"

import { Splash } from "./Splash/Splash";
import { Game } from "./Game/Game";
import { End } from "./End/End";
import { useGameState } from "./useGameState";

export default function Home() {
	const {stage, setStage, wordsState, initializeWords, setWordsState} = useGameState();

	return (
		<div>
			{stage === "splash" && (
				<Splash {...{setStage, initializeWords}} ></Splash>
			)}

			{stage === "game" && (
				<Game {...{wordsState, setStage, setWordsState}} ></Game>
			)}

			{stage === "end" && (
				<End {...{wordsState, setStage}} ></End>
			)}
		</div>
  );
}