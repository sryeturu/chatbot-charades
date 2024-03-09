'use client'

import React, { useState, useEffect, useRef } from "react";

export function useTimer() {
	const [timer, setTimer] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const startTime = useRef(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (isRunning) {
			startTime.current = Date.now() - timer; // Resume from the current timer value
			intervalRef.current = setInterval(() => {
				setTimer(Date.now() - startTime.current);
			}, 50);
		} else { // pause
			if(intervalRef.current) {
				clearInterval(intervalRef.current); 
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning]);

	const startTimer = () => setIsRunning(true);
	const stopTimer = () => setIsRunning(false);
	const restartTimer = () => {setTimer(0); setIsRunning(true)};

	return { timer, startTimer, stopTimer, restartTimer };
}

type TimerProps = {
	timer: number;
}

export function Timer({ timer }: TimerProps) {
	function getFormattedTime(timer: number) {
		const minutes = Math.floor(timer / 60000);
		const seconds = Math.floor((timer % 60000) / 1000);
		const milliseconds = Math.floor(timer % 1000);
	
		return (
			<p className="text-right">
				{(minutes > 0) && (
					<>
						<span className="inline-block w-10 text-sm sm:text-lg">{minutes}</span><span className="ml-1 text-[10px] sm:text-[11px]">m</span>
					</>
				)}
				<span className="inline-block ml-2 w-6 text-sm sm:text-lg">{seconds}</span><span className="ml-1 text-[10px] sm:text-[11px]">s</span>
				<span className="inline-block ml-2 w-9 text-sm sm:text-base">{milliseconds.toString().padStart(3, '0')}</span><span className="ml-2 text-[10px] sm:text-[11px]">ms</span>
			</p>
		)
	}
	
	return getFormattedTime(timer);
}
