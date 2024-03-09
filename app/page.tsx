"use client"

import { Splash } from "./Splash/Splash";
import { Game } from "./Game/Game";
import { End } from "./End/End";
import { useGameState } from "./useGameState";
import Head from "next/head";

export default function Home() {
	const {stage, setStage, wordsState, initializeWords, setWordsState} = useGameState();

	return (
		<div>
			<Head>
				<link rel="canonical" href="https://chatbotcharades.com" />
				<meta name="description"content="Test your wordplay skills with ChatBot Charades. 
				Give clever prompts to make the chatbot say the hidden word. Can you outsmart the AI and master the art of linguistic creativity?" />
			</Head>
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