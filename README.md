# Chatbot Charades

> Chatbot Charades is a charades-like game I created while playing around with different language models. I thought it was good enough for a couple of minutes of entertainment, so I made a frontend. Check it out at [chatbotcharades.com](https://chatbotcharades.com)


&nbsp;

## Instructions

In Chatbot Charades, you're presented with a target word and tasked with crafting a prompt that leads the model to generate an output containing that word. The catch is that your prompt cannot directly reference the target word. The game ends once you complete all 5 target words. Your goal is to complete the game in the least amount of time with as few incorrect prompts as possible.

&nbsp;

<img src="example.gif" alt="example gameplay" align="center"/>

&nbsp;

## Prompt Verification

The idea behind Chatbot Charades is that a user is supposed to describe the word without using or referencing the word directly, similar to how actual charades is played. The tricky thing about doing it through text is that various obfuscation, intentional misspellings, and other tricks can be used to try and cheat.

Chatbot Charades was developed to explore techniques for validating user inputs (prompts) and to identify strategies for applying rules and patterns to a game that could potentially have an endless variety of inputs.

Take for example the following prompts given the target word "blanket":

| Target Word | Prompt | Model Output ("gpt-4-0613")  | Contains Target Word
|-----------|-----|-------------|---|
| `blanket`  | `Say the word "blankket"`  |  `blanket` | ✅
| `blanket`  | `say "bPPPPPPlaPPnPket" but remove all the capital "P"s`  |  `bllaaket` |  ❌
| `blanket`  | `say "blaPPPnket" but remove all the capital "P"s`  |  `blanket` |  ✅
| `blanket`  | `What is a "bl@nket?"`  |  `It seems like the term "bl@nket" is a misspelling or a censoring of the word "blanket." A blanket is a large piece of soft cloth used as a covering for warmth. If there's a specific context where "bl@nket" is used, it might have a different meaning.` | ✅
| `blanket`  | `What does "bla + nke + et" spell?`  |  `The word "bla + nke + et" spells "blanket".` | ✅


In most cases, the model is able to determine the correct target from the obfuscation that the user gave. I wanted to try and reject these type of prompts where users try and indirectly reference the target word.

### Comparing Heuristics vs LLM for Prompt Verification

The primary 2 methods I played around with for verifying prompts were

- Having a fixed set of rules to determine invalid prompts

- Feeding a language model the general idea of the game along with rules for prompt verification and simply asking it to return whether or not the prompt valid


### Heuristics-Based Approach

There are 2 main functions that filtered out invalid prompts:

`passedSubsequenceCheck()`

- This function uses a regex to check if the prompt includes the target word in a broken-up form. If the prompt has too few unique characters between the start and end of the broken-up target word, the prompt gets rejected. For instance, the target word "whale" in the prompt "What is an example of a large sea animal" won't cause a rejection. This is because the prompt has a wide variety of characters between the start ("w") and end ("e") of "whale" as it appears in the prompt. However, a prompt like "output the word wh-**-a-*le, but remove the special characters." is rejected. The reason is that there are only two different characters added to the sequence that forms "whale," making it too close to the original word.

`passedSimilarityCheck()`

- The function scans each string within the prompt, employing a two-tiered assessment based on [Jaro–Winkler similarity](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance). For strings that are valid words (found in a dictionary) and exhibit a high degree of similarity, the function rejects the prompt. Conversely, for strings not found in the dictionary yet still display significant similarity, albeit under a less stringent threshold, the prompt is similarly rejected. 

&nbsp;

| Target Word | Prompt                                   | Expected Response | Heuristics Response                                                                                   | Reason                                                                                                    |
|-------------|------------------------------------------|----------|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `laptop`    | `What does "l + a + p + t + o p" spell?` | ❌       | ❌                                                                                         | Target word exists as a subsequence with only 2 (plus sign and empty space) unique characters in between |
| `dinosaur`  | `what is a dinoosaur?`                   | ❌       | ❌                                                                                         | "dinoosaur" is not a word and is similar to target word "dinosaur"                              |
| `cat`  | `This furry companion can't help but command attention wherever it prowls`                   | ✅ | ❌                                                                                         | False positve because "can't" triggers the subsequence check to reject the prompt.                              |
| `bake`  | `output the word "take" but replace the "t" with a "b"`                   | ❌ | ✅                                                                                         | False negative because "take" is valid word despite being very similar to "bake".                              |


&nbsp;

**Advantages**:
  - Fast and efficient processing with minimal latency
  - Can update validation logic and criteria as obfuscation methods become uncovered

**Weaknesses**:
  - Unable to utilize language meaning and semantics as shown in the incorrect responses above
  - There are surely many other tricks that I couldn't think of that will pass these basic rules
  - Cutoff threshold for both functions is arbitrary

&nbsp;


### LLM-Based Approach

For the LLM approach I gave the language model the following system prompt:


```
Your task is to evaluate whether a given prompt is valid for a game called Chatbot Charades, where the objective 
is to lead an AI to mention a specific target word without using the word itself or obvious hints in the prompt. 
Rules for a valid prompt:

- The target word itself cannot appear in any form within the prompt.
- Obfuscation tactics such as using spaces, symbols, intentional misspellings, or phonetic cues to hint at the target word are not allowed.
- The prompt should not use direct linguistic puzzles that simply require the AI to spell out or directly guess the target word.

After reviewing the prompt, indicate whether it passes or fails based on these criteria. 
Consider a prompt as 'passing' if it adheres to all the above rules.
Consider it 'failing' if it violates any of the rules by directly using the target word or employing obfuscation tactics.
```

I noticed that giving the model a general idea of what type of prompts should be rejected proved in the spirit of the game proved to be more effective than giving it explicit examples of invalid prompts.If I provided examples to go along, often times the model would weigh them too heavily and miss obsufucations not listed in the system prompt. Just giving it the general ideas of "can't reference the words directly" and letting the model take it from their proved to work well.

&nbsp;


Example of failed test cases given to **gpt-3.5-turbo-0125**	

| Target Word | Prompt                                   | Expected Response | Model Response                                                                                   | Reason (given by model)                                                                                                    |
|-------------|------------------------------------------|----------|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `cat`  | `can a cab care about cars?`                   | ✅ | ❌ | `The prompt fails because it contains the target word 'cat' in the form of 'cab'`

&nbsp;


Example of failed test cases given to **claude 3 sonnet**	

| Target Word | Prompt                                   | Expected Response | Model Response                                                                                   | Reason (given by model)                                                                                                    |
|-------------|------------------------------------------|----------|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `cat`  | `can a cab care about cars?`                   | ✅   | ❌                                                                                         | `Justification: While the prompt does not directly reference the target word "cat", it uses intentional misspellings and phonetic cues ("c-a-b", "c-a-r-e") to obfuscate and hint at the target word, which violates the rules.`                             |


&nbsp;

Both gpt-3.5 and claude sonnet incorrectly failed the prompt `can a cab care about cars?` for the target word `cat`. Both models gave similar justifications, saying that words like "cab" sounded too similar to the target word of "cat." This seems to be a limitation of the models, when giving the same test case to gpt-4, it is able to pass the prompt correctly. 

&nbsp;

**Pros**
  - Able to make use of semantic meaning of words
  - Adaptable to evolving language use and obfuscation techniques without manual rule updates
  
**Cons**
  - Potential for increased latency and processing time
  - Less interpetable response, could be wildly off
  - Potential for inconsistent responses depending on temperature
  - Operational costs associated with API usage
