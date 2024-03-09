const fs = require('fs');
const inflect = require('inflect');

// Function to get the base form (lemma) of a word
function getBaseForm(word) {
  // Use the inflect library to get the singular form of the word
  return inflect.singularize(word.toLowerCase());
}

// Read the text file and split it into an array of words
fs.readFile('target_words.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const wordsArray = data.trim().split('\n');
  const groupedWords = {};

  // Iterate through the words and group them based on their base form and singular/plural
  wordsArray.forEach(word => {
    const baseForm = getBaseForm(word);

    if (groupedWords[baseForm]) {
      groupedWords[baseForm].push(word);
    } else {
      groupedWords[baseForm] = [word];
    }
  });

  // Display or save the grouped words
  console.log(groupedWords);

  // If you want to save the grouped words to a file
  const groupedWordsString = JSON.stringify(groupedWords, null, 2);
  fs.writeFile('grouped_words.json', groupedWordsString, 'utf8', err => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('Grouped words have been saved to grouped_words.json');
  });
});
