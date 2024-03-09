import { TestCase, ValidationResult } from "./types";

  export async function runTests(isValidPrompt: (prompt: string, targetWord: string) => Promise<ValidationResult>, testCases: TestCase[]) {
    const results: Array<TestCase & {expected: string; got: string; reason: string}> = [];
    let passedCount = 0;
  
    for (const testCase of testCases) {
      console.log(`Test case #${results.length + 1}`)
  
      const { prompt, targetWord, shouldPass } = testCase;
      try {
        const result = await isValidPrompt(prompt, targetWord);
        const didPass = result.passed === shouldPass;
        if (didPass) {
          passedCount++;

        }
        const test = {
          ...testCase,
          expected: shouldPass ? 'Pass' : 'Fail',
          got: result.passed ? 'Pass' : 'Fail',
          reason: result.reason ? result.reason : 'None' // Include the reason for failure
        }

        results.push(test);
        console.log(`Prompt: "${test.prompt}" \nTarget: "${test.targetWord}" \nExpected: "${test.expected}", Got: "${test.got}" ${test.expected != test.got ? "❌" : ""} \nReasons: ${test.reason}\n\n`);

      } catch (error) {
        console.error(`Error processing test case with prompt: ${prompt}`, error);
        results.push({
          ...testCase,
          expected: 'Error',
          got: 'Error processing test case',
          reason: "error"
        });
      }
    }
  
    const summary = {
      totalTests: testCases.length,
      passedTests: passedCount,
      failedTests: testCases.length - passedCount,
    };
  
    console.log("Summary:", summary);
  }
  



