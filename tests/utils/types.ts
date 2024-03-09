
export type ValidationResult = {
    passed: boolean;
    reason?: string;
}

export type TestCase = {
    prompt: string;
    targetWord: string;
    shouldPass: boolean;
  }
  