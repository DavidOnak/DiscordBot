// This file contains support functions for analyzing string inputs from discord messages for the bot's reponces
const syllable = require('syllable');


// Check if given work exits in given string
function wordExistsInString(inputString, wordToFind) {
    const lowerInput = inputString.toLowerCase();
    const lowerWord = wordToFind.toLowerCase();
  
    // Use word boundaries (\b) to check if the lowercased word exists as a standalone word in the lowercased string
    const regex = new RegExp(`\\b${lowerWord}\\b`);
    return regex.test(lowerInput);
}

// Get the mentioned users, excluding the message sender and bots
async function getOtherUserMentions(message) {
    const guild = message.guild;
    await guild.members.fetch();
  
    const mentionedMembers = guild.members.cache
      .filter(member => !member.user.bot && member.id !== message.author.id)
      .map(member => `<@${member.id}>`);
  
    // Create a mention string
    return mentionedMembers.join(' ');
}

// Returns null if no Haiku can be formed with input message and returns a Haiku of message if it exits.
function detectHaiku(message) {
    const words = message.split(/\s+/);

    // A Haiku consists of 3 lines with 5, 7, 5 syllables
    let syllableCount = [0, 0, 0] 
    let haiku = ['', '', '']

    // Will itterating through words, build haiku, if no longer possible return null
    for (const word of words) {
        if (syllableCount[0] < 5) {
            syllableCount[0] += syllable(word);
            if (syllableCount[0] > 5) return null; else haiku[0] += ` ${word}`;
        } else if (syllableCount[1] < 7) {
            syllableCount[1] += syllable(word);
            if (syllableCount[1] > 7) return null; else haiku[1] += ` ${word}`;
        } else if (syllableCount[2] < 5) {
            syllableCount[2] += syllable(word);
            if (syllableCount[2] > 5) return null; else haiku[2] += ` ${word}`;
        } else return haiku;
    }
}

module.exports = {
    wordExistsInString,
    getOtherUserMentions,
    detectHaiku
  };