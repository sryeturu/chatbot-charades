'use client'

import React, { useState, FormEvent, Dispatch, SetStateAction, useRef, useEffect } from "react";
import { PromptForm } from './PromptForm';
import { Circles } from './Circles';
import { Tally } from './Tally';
import { Timer } from '../utils/Timer';

import Image from 'next/image';
import nextArrow from "../../public/images/next_arrow.svg";
import "../../public/css/game.css"

import { PromptResponse, PromptResponseStatus } from "@/types/promptResponse";
import { WordState } from "@/types/words";
import { useGameLogic } from "./useGameLogic";
import { OutputDisplay } from "./OutputDisplay";

interface GameProps {
	setStage: Dispatch<SetStateAction<Stage>>;
	wordsState: WordState[];
	setWordsState: Dispatch<SetStateAction<WordState[]>>;
}

export function Game({ setStage, wordsState, setWordsState }: GameProps) {
	const [filledCircles, setFilledCircles] = useState<number>(1);

	const formRef = useRef<HTMLDivElement>(null);
	const [blockInput, setBlockInput] = useState<boolean>(false);
	const [nextButtonStatus, setNextButtonStatus] = useState<'hidden' | 'next' | 'final'>("hidden");

	const [response, setResponse] = useState<PromptResponse | null>(null);

	const [isFetchingResponse, setIsFetchingResponse] = useState(false);

	const {
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
	} = useGameLogic({ wordsState, setWordsState });

	useEffect(() => {
		startTimer();
	}, []);

	async function handleSubmit(event: FormEvent) {	
		event.preventDefault();

		const inputValue = formRef?.current?.innerText;

		if (inputValue) {
			stopTimer();
			setBlockInput(true);

			setIsFetchingResponse(true);
			const res = await getPromptResponse(inputValue);
			setIsFetchingResponse(false);

			setResponse(res);
		}
	}

	const finishedTyping = () => {
		if (response?.status === PromptResponseStatus.SUCCESS) {
			handleCorrectGuess();
		} else {
			handleIncorrectGuess();
		}
	}

	function handleNext() {
		setNextButtonStatus("hidden")

		if (isFinalWord()) {
			setStage("end");
		} else {
			setFilledCircles((prevFilledCircles) => prevFilledCircles + 1);

			moveToNextWord();

			setResponse(null);
			setBlockInput(false);
			if (formRef.current) {
				formRef.current.innerHTML = "";
				formRef.current.focus();
			}

			restartTimer();
		}
	}

	function handleCorrectGuess() {
		recordCorrectGuessStats();
		  
		setTimeout(() => {
			if (isFinalWord()) {
				setNextButtonStatus("final");
			} else {
				setNextButtonStatus("next");
			}
		}, 250);
	}

	function handleIncorrectGuess() {
		incrementIncorrectGuesses();

		setTimeout(() => {
			setBlockInput(false);
			if (formRef.current) {
				formRef.current.innerHTML = "";
				formRef.current.focus();
			}
			startTimer();
			setResponse(null);
		}, 3500);
	}
  
	return (
		<main className='flex flex-col sm:flex-row min-h-screen justify-between bg-white-2 font-cutive'>
			<div className="flex sm:hidden justify-between text-gray-600">
				<div className="ml-5 mt-5">
					{incorrectGuesses > 0 ? -incorrectGuesses : ""}
				</div>

				<div className="mr-5 mt-5">
					<Timer {...{ timer }} />
				</div>
			</div>

			<div className="hidden sm:flex justify-start items-start gap-3 w-56 pl-8 pt-5 text-gray-600">
				<div className="w-[147px]">
					<Tally count={incorrectGuesses}></Tally>
				</div>
			</div>

			<div className='flex flex-col flex-grow justify-between items-center pt-20 sm:pt-32 bg-white-2 font-cutive'>
				<div className="w-72 sm:w-[550px] pt-12 flex flex-col">
					<div className="flex flex-row justify-center">
						<p className="h-10 sm:h-[80px] mb-16 font-cutive tracking-[2px] text-gray-700 text-xl sm:text-5xl">&quot;{wordsState[wordIndex].word.toUpperCase()}&quot;</p>
					</div>

					<div className="w-full mb-14">
						<PromptForm {...{ formRef, handleSubmit, blockInput, wordIndex }} />
					</div>
					{response && (
						<OutputDisplay targetWord={wordsState[wordIndex].word} response={response} callback={finishedTyping}/>
					)}

					<div className='flex justify-center'>
						{isFetchingResponse && (
							[...Array(3)].map((_, index) => (
								<div
									key={index}
									className="flex w-2 h-2 rounded-full bg-gray-500 mr-2 animate-pulse"
									style={{ animationDelay: `${index * 0.2}s` }}
								></div>
							))
						)}
					</div>
				</div>

				<div className='flex flex-col items-center gap-16'>
					{nextButtonStatus !== "hidden" && (
						<button className="w-[143px] h-[54px] rounded-md flex items-center justify-center my-pulse bg-gray-600" type="submit" onClick={handleNext}>
							<span className="pr-2 text-sm tracking-widest text-white-2">{nextButtonStatus === "next" ? "NEXT" : "FIN"}</span>
							{nextButtonStatus === "next" && (
								<Image className="pb-2" src={nextArrow} alt="next arrow" />
							)}
						</button>
					)}
					<div className="inline-flex space-x-2 pb-11">
						<Circles {...{ numberOfCircles: wordsState.length, filledCircles }}></Circles>
					</div>
				</div>
			</div>

			<div className="hidden sm:flex justify-end w-56 pr-8 pt-5 text-gray-700">
				<Timer {...{ timer }} />
			</div>
		</main>
	);
}
