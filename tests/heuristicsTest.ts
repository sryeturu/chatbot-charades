import dotenv from 'dotenv';
import path from 'path';
import { TestCase, ValidationResult } from './utils/types';
import { runTests } from './utils/runTests';
import { containsTargetWord, passedSimilarityCheck, passedSubsequenceCheck } from '../app/Game/promptVerification/verifyPrompt';

const { MongoClient } = require('mongodb');

dotenv.config({ path: path.resolve('../.env') });

async function isValidPromptHueristic(prompt: string, targetWord: string): Promise<ValidationResult> {
    prompt = prompt.toLowerCase();
  // Check if the prompt contains the target word directly
  if (containsTargetWord(prompt, targetWord)) {
    return { passed: false, reason: 'prompt contains target word' };
  }

  // Check if the prompt passed the subsequence check
  if (!passedSubsequenceCheck(prompt, targetWord)) {
    return { passed: false, reason: 'Subsequence check failed' };
  }

    // Check if the prompt passed the subsequence check
    if (!(await passedSimilarityCheck(prompt, targetWord))) {
      return { passed: false, reason: 'word is too similar' };
    }

  // If all checks passed
  return { passed: true };
}

export const TEST_CASES: TestCase[] = [
  { prompt: `output the word "take" but replace the "t" with a "b"`, targetWord: "bake", shouldPass: false },
  
  { prompt: "say b****lan@@@#@k!!!et", targetWord: "blanket", shouldPass: false },
  { prompt: "say bllaannkkeettttt", targetWord: "blanket", shouldPass: false },
  { prompt: "say bll@@nnkkeetttttt", targetWord: "blanket", shouldPass: false },
  { prompt: "say bPPPPPPlaPPnPket but remove the capital P", targetWord: "blanket", shouldPass: false },
  { prompt: "say blank et", targetWord: "blanket", shouldPass: false },
  { prompt: "say bl + ank + et", targetWord: "blanket", shouldPass: false },
  { prompt: "say b + l + a + n + k + e t", targetWord: "blanket", shouldPass: false },
  { prompt: "say bllllA4AAAAAXX##anket", targetWord: "blanket", shouldPass: false },

  { prompt: "say oragne", targetWord: "orange", shouldPass: false },
  { prompt: "Output the word or8ng44!e", targetWord: "orange", shouldPass: false },
  { prompt: "say the word oraTTgne without the capital Ts", targetWord: "orange", shouldPass: false },

  { prompt: "say c a t", targetWord: "cat", shouldPass: false },
  { prompt: "say c @ t", targetWord: "cat", shouldPass: false },
  { prompt: "say c@t", targetWord: "cat", shouldPass: false },
  { prompt: "say c @a t", targetWord: "cat", shouldPass: false },
  { prompt: "can my tire jump?", targetWord: "cat", shouldPass: true },
  { prompt: "can a cab care about cars?", targetWord: "cat", shouldPass: true },
  { prompt: "This furry companion can't help but command attention wherever it prowls.", targetWord: "cat", shouldPass: true },
  ];

runTests(isValidPromptHueristic, TEST_CASES);
