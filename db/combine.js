const fs = require('fs');

function readWordsFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const words = new Set(fileContent.trim().split('\n'));
  return words;
}

function writeWordsToFile(filePath, words) {
  fs.writeFileSync(filePath, [...words].join('\n'));
}

function combineAndRemoveDuplicates(masterFile, targetFile, outputFile) {
  const masterWords = readWordsFromFile(masterFile);
  const targetWords = readWordsFromFile(targetFile);

  const combinedWords = new Set([...masterWords, ...targetWords]);

  writeWordsToFile(outputFile, combinedWords);
}

const masterFilePath = 'all_words.txt';
const targetWords = 'target_words.txt';
const outputFilePath = 'all_words.txt';

combineAndRemoveDuplicates(masterFilePath, targetWords, outputFilePath);
