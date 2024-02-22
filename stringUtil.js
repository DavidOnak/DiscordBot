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

function detectHaiku(message) {

}

module.exports = {
    wordExistsInString,
    getOtherUserMentions,
    detectHaiku
  };