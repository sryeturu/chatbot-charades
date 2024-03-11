const { MongoClient } = require('mongodb');
import { jaroWinkler } from './jaroWinkler';

function cleanWord(word: string): string {
    return word.replace(/[\.,?!*#@^&(){}\[\]'"~+\-\\|$_=%:;><]/g, '');  
}

function containsTargetWord(prompt: string, targetWord: string): boolean {
    const normalizedPrompt = prompt.replace(/[^a-z0-9]+/g, "");
    return normalizedPrompt.includes(targetWord);
}

function passedSubsequenceCheck(prompt: string, targetWord: string): boolean {
    const regex = new RegExp(`${targetWord.split('').join('\\S*?')}`, 'gi');
    let match: RegExpExecArray | null;

    const uniqueCharsNeeded = targetWord.length <= 3 ? 3 : 4;
    const threshold = targetWord.length + uniqueCharsNeeded;
    
    while ((match = regex.exec(prompt)) !== null) {
        const startIndex = match.index;
        const endIndex = regex.lastIndex - 1;
        const substring = prompt.substring(startIndex, endIndex + 1);
        
        const uniqueChars = new Set(substring.replace(/\s/g, '')).size;
        
        if (uniqueChars < threshold) {
            return false;
        }
    }
    
    return true;
}

async function passedSimilarityCheck(prompt: string, targetWord: string): Promise<boolean> {
    let client;

    try {
        client = await MongoClient.connect(process.env.MONGODB_URI!);
        const db = client.db();

        let words = prompt.split(/\s+/).map(word => cleanWord(word));
        let query = { word: { $in: words } };
        let foundWords = await db.collection("allWords").find(query).toArray().then((docs: any[]) => docs.map(doc => doc.word));
        let foundWordsSet = new Set(foundWords);

        for (let word of words) {
            word = cleanWord(word);

            const similarityScore = jaroWinkler(word, targetWord);
            if (similarityScore >= 0.92) {
                return false;
            }

            if (!foundWordsSet.has(word) && similarityScore >= 0.8) {
                return false;
            }
        }
    } catch (err) {
        console.error('Error checking words in the collection:', err);
        return false;
    } finally {
        if (client) client.close();
    }

    return true;
}

async function isValidPrompt(prompt: string, targetWord: string): Promise<boolean> {
    prompt = prompt.toLowerCase();
    
    if (containsTargetWord(prompt, targetWord) || !passedSubsequenceCheck(prompt, targetWord) || !(await passedSimilarityCheck(prompt, targetWord))) {
        return false;
    }

    return true;
}

export {
    containsTargetWord,
    passedSubsequenceCheck,
    passedSimilarityCheck,
    isValidPrompt,
}