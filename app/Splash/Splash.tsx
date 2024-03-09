"use client"

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { fetchWords } from "./fetchWords";
import { TypewriterComponent } from "../utils/Typewriter";

type SplashProps = {
	setStage: Dispatch<SetStateAction<Stage>>;
	initializeWords: (words: string[]) => void;
}

export function Splash({ setStage, initializeWords }: SplashProps) {
	const [displayTitle, setDisplayTitle] = useState(false);
	const [displayStartButton, setDisplayStartButton] = useState(false);

	const promiseRef = useRef<Promise<boolean>>();
	const resolveRef = useRef<(value: boolean | PromiseLike<boolean>) => void>();
    
	if (!promiseRef.current) {
		promiseRef.current = new Promise<boolean>((resolve) => {
			resolveRef.current = resolve;
		});
	}
    
	useEffect(() => {
		let typewriterInterval : NodeJS.Timer;
		setDisplayTitle(true);

		const initSplashPage = async () => {
			const wordsPromise = fetchWords();

			const [words, _] = await Promise.all([wordsPromise, promiseRef.current]);

			if(words) {
				initializeWords(words);
				setDisplayStartButton(true);    
			}
		};

		initSplashPage();

		return () => {
			if (typewriterInterval) {
				clearInterval(typewriterInterval);
			}
		};
	}, []);

	const handleButtonClick = () => {
		setStage("game");
	};

	return (
		<div className='flex flex-col min-h-screen items-center tracking-[2px] text-5xl gap-y-60  text-gray-700 bg-white-2 font-cutive'>
			<div className="pt-32 text-center">
				{ displayTitle && <TypewriterComponent text={"Chatbot Charades"} callback={() => {resolveRef.current?.(true)}}/>}
			</div>
			{displayStartButton && (
				<button
					className="w-[143px] h-[54px] flex items-center justify-center shadow-xl text-white-1 bg-gray-700 rounded-md border-2 border-gray-700 hover:text-gray-700 hover:border-2 hover:bg-white-1 hover:opacity-70"
					type="submit"
					onClick={handleButtonClick}
				>
					<span className="pr-2 text-sm tracking-widest">START</span>
				</button>
			)}
		</div>
	);
}
