"use client"

import { useState } from "react";
import { WordState } from "@/types/words";

export function useGameState() {
    const [stage, setStage] = useState<Stage>("splash");
    const [wordsState, setWordsState] = useState<WordState[]>([]);

    const initializeWordsState = (words: string[]) => {
        const newWordState : WordState[] = words.map((word) => {return {word, guesses: 0, time: 0 }})

        setWordsState(newWordState);
    }

    return {stage, setStage, wordsState, setWordsState, initializeWordsState};
}
