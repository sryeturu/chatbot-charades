import React, { FormEvent, useEffect } from "react";
import { RefObject } from "react";

type PromptFormProps = {
	formRef: RefObject<HTMLDivElement>;
	handleSubmit: (event: FormEvent) => void;
	blockInput: boolean;
}

export function PromptForm({ formRef, handleSubmit, blockInput }: PromptFormProps) {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event?.key === "Enter" && !event?.shiftKey && formRef?.current?.contains(event.target as Node)) {
				handleSubmit(event as unknown as FormEvent); // Call handleSubmit when Enter is pressed inside the form
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleSubmit]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="w-full flex">
				<div
					ref={formRef}
					className={`w-full max-h-[200px] p-2 
						overflow-hidden caret-color-auto
						border-2 focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-400 rounded-md
						${blockInput ? "bg-gray-300" : "bg-white-1"} bg-opacity-70 shadow-md
						text-gray-700`}
					contentEditable={!blockInput}
					role="textbox"
					aria-label="Enter your prompt here"
					tabIndex={0}
				></div>
				<button
					disabled={blockInput}
					className={`h-[43px] w-[45px] font-inter ${blockInput ? 'cursor-not-allowed pointer-events-none' : ""}
						text-white-1 bg-gray-400 ml-5 text-3xl rounded-md pb-1 border-2 border-gray-400 hover:text-gray-400 hover:border-2 hover:bg-white-1 hover:opacity-70`}
					type="submit"
					style={{
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
					}}
				>
					{">"}
				</button>
			</div>
		</form>
	);
}
