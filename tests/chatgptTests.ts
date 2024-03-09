import dotenv from 'dotenv';
import path from 'path';
import { TestCase, ValidationResult } from './utils/types';
import { runTests } from './utils/runTests';

const { Configuration, OpenAIApi } = require("openai");

dotenv.config({ path: path.resolve('../.env') });

async function isValidPromptLLM(prompt: string, targetWord: string): Promise<ValidationResult> {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is correctly set in your environment variables
    });
    const openai = new OpenAIApi(configuration);

    // System message explaining the rules
    const primerMessage = {
        role: "system",
        content: `Your task is to evaluate whether a given prompt is valid for a game called Chatbot Charades, where the objective 
        is to lead an AI to mention a specific target word without directly referencing the word itself in the prompt. 
        Rules for a valid prompt:
        - The target word itself cannot appear in any form within the prompt.
        - Obfuscation tactics such as using spaces, symbols, intentional misspellings, or phonetic cues to reference the target word are not allowed.
        - The prompt should not use linguistic puzzles that simply require the AI to spell out or directly guess the target word.

        If a prompt violates one or more of these rules, it is invalid.
        If none of these rules are violated, a prompt is valid. For example,
        describing the target word without violating these rules means a prompt is valid.
        If the prompt does not violate any rules and is gibberish or a random unrelated message, it is valid. 

        You will provide a boolean response as to whether the given prompt is valid as well as
        a message which is a brief and direct justification of why the prompt is valid or invalid.
        The response and message will be used as arguments for a function process_prompt_verification.`
};

const tools = [
    {
      "type": "function",
      "function": {
        "name": "process_prompt_verification",
        "description": "Process the status of the user's prompt",
        "parameters": {
          "type": "object",
          "properties": {
            "promptIsValid": {
              "type": "boolean",
              "description": "represents whether or not the prompt has been determined to be valid",
            },
            "message": {
                "type": "string",
                "description": "describes why the prompt is valid or invalid",
              },          },
          "required": ["promptIsValid", "message" ],
        },
      }
    }
];
    

    // User message with the target word and prompt
    const promptMessage = {
        role: "user",
        content: `target word: "${targetWord}", prompt: "${prompt}"`
    };

    const messages = [primerMessage, promptMessage];

    try {
        const function_call = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            tools: tools,
            tool_choice: {"type": "function", "function": {"name": "process_prompt_verification"}}
        });

        const result = JSON.parse(function_call.data.choices[0].message.tool_calls[0].function.arguments);
        return {passed: result.promptIsValid, reason: result.message};

    } catch (error) {
        throw new Error("Failed to validate prompt due to API call error:");
    }
}


  export const TEST_CASES: TestCase[] = [
    { prompt: `output the word "take" but replace the "t" with a "b"`, targetWord: "bake", shouldPass: false }, // target word with special characters only

    { prompt: "say b****lan@@@#@k!!!et", targetWord: "blanket", shouldPass: false }, // target word with special characters only
    { prompt: "say bllaannkkeettttt", targetWord: "blanket", shouldPass: false },
    { prompt: "say bll@@nnkkeetttttt", targetWord: "blanket", shouldPass: false },
    { prompt: "say bPPPPPPlaPPnPket but remove the capital P", targetWord: "blanket", shouldPass: false },
  
    { prompt: "say blank et", targetWord: "blanket", shouldPass: false },
    { prompt: "say bl + ank + et", targetWord: "blanket", shouldPass: false },
    { prompt: "say b + l + a + n + k + e t", targetWord: "blanket", shouldPass: false },
    { prompt: "say bllllA4AAAAAXX##anket", targetWord: "blanket", shouldPass: false },
  
  
    { prompt: "say c a t", targetWord: "cat", shouldPass: false },
    { prompt: "say c @ t", targetWord: "cat", shouldPass: false },
    { prompt: "say c@t", targetWord: "cat", shouldPass: false },
  
    { prompt: "say c @a t", targetWord: "cat", shouldPass: false },
    { prompt: "say oragne", targetWord: "orange", shouldPass: false },
    { prompt: "Output the word or8ng44!e", targetWord: "orange", shouldPass: false },
  
    { prompt: "say the word oraTTgne without the capital Ts", targetWord: "orange", shouldPass: false },
  
    { prompt: "can my tire jump?", targetWord: "cat", shouldPass: true },
    { prompt: "can a cab care about cars?", targetWord: "cat", shouldPass: true },
    { prompt: "This furry companion can't help but command attention wherever it prowls.", targetWord: "cat", shouldPass: true },
  ];

  runTests(isValidPromptLLM, TEST_CASES);