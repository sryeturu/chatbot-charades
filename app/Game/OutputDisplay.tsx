import { PromptResponse, PromptResponseStatus } from "@/types/promptResponse";
import React, { useRef, useState } from "react";
import { ReactNode } from "react";
import { useTypewriterEffect } from "../utils/Typewriter";

type OutputDisplayProps = {
	targetWord: string,
	response: PromptResponse,
	callback: Function,
}

export function OutputDisplay({ targetWord, response, callback }: OutputDisplayProps) {
	const isFinishedTypingRef = useRef<boolean>(false);

	const textToDisplay = useTypewriterEffect(response.message, 20, () => { callback(); isFinishedTypingRef.current = true; });
	
	function getBackgrounColorClass() {
		if (!isFinishedTypingRef.current) {
			return "bg-gray-200";
		}

		if (response.status === PromptResponseStatus.SUCCESS) {
			return "bg-green-100";
		} else {
			return "bg-red-error";
		}
	}

	function getFormattedOutput(target: string, output: string, foundMatch: boolean): ReactNode {
		if (!foundMatch) {
			return output;
		}
		
		const regex = new RegExp(target, 'gi');
		const parts = output.split(regex);
		const matches = Array.from(output.matchAll(regex));
		
		const formattedOutput: ReactNode[] = parts.reduce((acc: ReactNode[], part, index) => {
			acc.push(<React.Fragment key={index}>{part}</React.Fragment>);
			if (index < parts.length - 1) {
				const match = matches[index][0];
				acc.push(<span key={`match-${index}`} className="text-green-600 font-bold">{match}</span>);
			}
			return acc;
		}, []);
		
		return <span>{formattedOutput}</span>;
	}	
      
	return (
		<p className={`w-full font-cutive mb-10 text-slate-900 bg-gray-300 rounded-md text-sm sm:text-base sm:leading-loose ${textToDisplay ? "p-3" : ""} ${getBackgrounColorClass()}`}>
			{getFormattedOutput(targetWord, textToDisplay, response?.status === PromptResponseStatus.SUCCESS)}
		</p>
	);
}
