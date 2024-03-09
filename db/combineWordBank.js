const fs = require('fs').promises;

async function readWordsFromFile(filename) {
  const fileContent = await fs.readFile(filename, 'utf-8');
  return fileContent.split('\n').map(word => word.trim());
}

function sortWordsByLength(words) {
  return words.sort((a, b) => {
    const lengthComparison = a.length - b.length;

    if (lengthComparison === 0) {
      return a.localeCompare(b);
    }

    return lengthComparison;
  });
}

function removeDuplicates(words) {
  const uniqueWordsSet = new Set(words);
  return Array.from(uniqueWordsSet);
}

async function writeWordsToFile(filename, words) {
  const fileContent = words.join('\n');
  await fs.writeFile(filename, fileContent.trim(), 'utf-8');
}

async function cleanFile(fileName) {
  try {
    let words = await readWordsFromFile(fileName);
    words = removeDuplicates(words);
    const sortedWords = sortWordsByLength(words);
    await writeWordsToFile(fileName, sortedWords);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function combineAndClean(inputFiles, outputFile) {
  try {
    const combinedWords = [];

    for (const file of inputFiles) {
      const words = await readWordsFromFile('wordBank/' + file);
      combinedWords.push(...words);
      await cleanFile('wordBank/' + file);
    }

    const uniqueWords = removeDuplicates(combinedWords);
    const sortedWords = sortWordsByLength(uniqueWords);

    await writeWordsToFile(outputFile, sortedWords);
  } catch (error) {
    console.error('Error:', error);
  }
}

const inputFiles = ['10k_popular_words.txt', 'charades_words.txt', 'countries.txt'];
const outputFile = 'target_words.txt';

combineAndClean(inputFiles, outputFile);
