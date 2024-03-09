"use client"

import React, { Dispatch, SetStateAction } from 'react';
import { Timer } from '../utils/Timer';
import { WordState } from '@/types/words';

interface EndProps {
	setStage: Dispatch<SetStateAction<Stage>>;
	wordsState: WordState[];
}

export function End({ setStage, wordsState }: EndProps) {
	const handleButtonClick = () => {
		setStage('splash');
	};

	return (
		<div className="min-h-screen flex flex-col bg-white-2 font-cutive justify-between">
			<div className="mb-44 pt-24 pl-10 pr-10 grid gap-y-28 justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 text-slate-900">
				{wordsState.map((item, index) => (
					<div key={index} className="flex flex-col h-48 w-72 p-4 justify-between items-center rounded-md bg-gray-300 shadow-xl">
						<div className="">
							{item.word.toUpperCase()}
						</div>
						<div>
							<Timer timer={item.time}/>
						</div>
						<div>
							{item.guesses > 0 ? "- " + item.guesses : "0"}
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center mb-24">
				<button className="w-[70px] h-[65px] flex items-center justify-center text-white-2 bg-gray-400 rounded-md pb-1 border-2 border-gray-400 hover:text-gray-400 hover:border-2 hover:bg-white-1 hover:opacity-70" onClick={handleButtonClick}>
					<svg className='fill-current' height="50" width="35" viewBox="0 0 74.999 74.999">
						<g>
							<path d="M33.511,71.013c15.487,0,28.551-10.563,32.375-24.859h9.113L61.055,22L47.111,46.151h8.006c-3.44,8.563-11.826,14.628-21.605,14.628c-12.837,0-23.28-10.443-23.28-23.28c0-12.836,10.443-23.28,23.28-23.28c6.604,0,12.566,2.768,16.809,7.196l5.258-9.108c-5.898-5.176-13.619-8.32-22.065-8.32C15.034,3.987,0,19.019,0,37.5C-0.002,55.981,15.03,71.013,33.511,71.013z" />
						</g>
					</svg>
				</button>
			</div>
		</div>
	);
}
