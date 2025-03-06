"use server"

import { PromptResponse, PromptResponseStatus } from "../../types/promptResponse"
import { isValidPrompt } from './promptVerification/verifyPrompt';

const { Configuration, OpenAIApi } = require("openai");

export async function fetchPromptResponse(targetWord: string, prompt: string): Promise<PromptResponse> {
	try {
		const isValid = await isValidPrompt(prompt, targetWord);

		if (!isValid) {
			return { status: PromptResponseStatus.FAILED, message: "The prompt you have entered is illegal, please try again." };
		} else {
			const response = await fetchPromptMessage(prompt);
			const success = response.toLowerCase().includes(targetWord);

			return { status: success ? PromptResponseStatus.SUCCESS : PromptResponseStatus.FAILED, message: response };
		}
	} catch (error) {
		console.error("An error occurred:", error);
		return { status: PromptResponseStatus.FAILED, message: "An unexpected error occurred. Please try again." };
	}
}

async function fetchPromptMessage(prompt: string) : Promise<string> {
	const maxPromptLength = 250;

	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);

	const systemMessage = {
        role: "system",
        content: "You are chatbot that should provide relevant responses to a user's messages. Your responses should never exceed 4 sentences."
    };
	const userMessage = {
		role: "user", content: prompt.slice(0, maxPromptLength)
	};

	const chat_completion = await openai.createChatCompletion({
		model: "gpt-4o-mini",
		max_tokens: 80,
		temperature: .6,
		messages: [systemMessage, userMessage],
	});

	return chat_completion.data.choices[0].message.content;
}

