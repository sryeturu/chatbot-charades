const fs = require('fs').promises;

// Function to read the grouped words from 'grouped_words.json'
async function readGroupedWords() {
  const groupedData = await fs.readFile('grouped_words.json', 'utf8');
  return JSON.parse(groupedData);
}

// Function to read the target words from 'target_words.txt'
async function readTargetWords() {
  const targetData = await fs.readFile('target_words.txt', 'utf8');
  return targetData.trim().split('\n');
}

// Function to filter out the plural words from the target words
function filterPluralWords(targetWordsArray, groupedWords) {
  const deletedWords = [];
  const filteredWordsArray = targetWordsArray.filter(word => {
    if (groupedWords[word]) {
      return true;
    }
    deletedWords.push(word);
    return false;
});
  return { filteredWordsArray, deletedWords };
}

// Function to save the filtered words back to 'target_words.txt'
async function saveFilteredWords(filteredWordsArray) {
  const filteredWordsString = filteredWordsArray.join('\n');
  await fs.writeFile('target_words.txt', filteredWordsString, 'utf8');
  console.log('Plural words have been removed from target_words.txt');
}

// Main function to orchestrate the process
async function main() {
  try {
    const groupedWords = await readGroupedWords();
    const targetWordsArray = await readTargetWords();
    const { filteredWordsArray, deletedWords } = filterPluralWords(targetWordsArray, groupedWords);
    await saveFilteredWords(filteredWordsArray);
    console.log('Deleted words:', deletedWords);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Call the main function to start the process
main();
