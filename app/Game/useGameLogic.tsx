import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { fetchPromptResponse } from './fetchPromptResponse';
import { WordState } from '@/types/words';
import { useTimer } from '../utils/Timer';

interface useGameLogicProps {
	wordsState: WordState[];
	setWordsState: Dispatch<SetStateAction<WordState[]>>;
}

export const useGameLogic = ({ wordsState, setWordsState }: useGameLogicProps) => {
	const { timer, startTimer, stopTimer, restartTimer } = useTimer();

	const [wordIndex, setWordIndex] = useState<number>(0);
	const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);

	async function getPromptResponse(prompt: string) {
		return await fetchPromptResponse(wordsState[wordIndex].word, prompt);
	}

	function recordCorrectGuessStats() {
		setWordsState((prevState) => {
			return prevState.map((item, index) => {
				if (index === wordIndex) {
					return { word: item.word, guesses: incorrectGuesses, time: timer };
				}
				return item;
			});
		});
	}

	function incrementIncorrectGuesses() {
		setIncorrectGuesses(prev => prev + 1)
	}

	function isFinalWord() {
		return wordIndex === wordsState.length - 1;
	}

	function moveToNextWord() {
		setWordIndex(currentWordIndex => currentWordIndex + 1);
		setIncorrectGuesses(0);
	}

	return {
		timer,
		startTimer,
		stopTimer,
		restartTimer,

		wordIndex,
		incorrectGuesses,
		getPromptResponse,
		recordCorrectGuessStats,
		incrementIncorrectGuesses,
		moveToNextWord,
		isFinalWord,
	};
};
