const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Set bot permissions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// spotify option
// Set up bot commands
client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const prefix = '!';  // Set your desired command prefix

function wordExistsInString(inputString, wordToFind) {
  const lowerInput = inputString.toLowerCase();
  const lowerWord = wordToFind.toLowerCase();

  // Use word boundaries (\b) to check if the lowercased word exists as a standalone word in the lowercased string
  const regex = new RegExp(`\\b${lowerWord}\\b`);
  return regex.test(lowerInput);
}

// const resource = createAudioResource('videoName.mp3');

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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  
    // // Set an interval to send a message every 10 seconds
    // setInterval(() => {
    //   const channel = client.channels.cache.get('1200324232635232426'); // Replace with your text channel ID
    //   if (channel) {
    //     channel.send(`This message will run each hour to see if the bot can run off my comp when I'm not using it`);
    //   }
    // }, 3600000); // Interval in milliseconds (10 seconds in this case)
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  // Check if the author of the edited message is a bot to avoid processing bot messages
  if (newMessage.author.bot) return;

  // Console details on message edit
  console.log(`Message edited by ${newMessage.author.tag} in channel ${newMessage.channel.name}`);
  console.log('Old Message:', oldMessage.content);
  console.log('New Message:', newMessage.content);

  newMessage.reply("https://tenor.com/view/rock-one-eyebrow-raised-rock-staring-the-rock-gif-22113367");
});

client.on('messageCreate', async (message) => {
    const sender = message.author;
    const input = message.content;
    const urlPattern = /(https?:\/\/[^\s]+)/;
    console.log('Message received:', input);
    console.log('From:', sender);

    if (!sender.bot) {
        if (!message.content.startsWith(prefix)) {
          if (urlPattern.test(message.content)) {
            // return message.channel.send("https://tenor.com/view/rock-one-eyebrow-raised-rock-staring-the-rock-gif-22113367");
            return
          }
          // Check if the message mentions any users
          if (message.mentions.users.size > 0) {
            message.mentions.users.forEach((user) => {
              // Check if the mentioned user is the same as the bot
              if (user.id === client.user.id) {
                console.log('Bot has been mentioned in the message:', message.content);
                return message.reply("What?");
              } else {
                return message.channel.send("https://tenor.com/view/rock-one-eyebrow-raised-rock-staring-the-rock-gif-22113367");
              }
            });
          }
          // Check for key words in message
          if (input === '?') return message.channel.send(`Get on now! ${await getOtherUserMentions(message)}`);

        } else {
          const commandIndex = message.content.indexOf(prefix);
          // Extract the command and the rest of the message
          const commandAndArgs = message.content.slice(commandIndex + prefix.length).trim();
          const firstSpaceIndex = commandAndArgs.indexOf(' ');
          const commandName = firstSpaceIndex !== -1 ? commandAndArgs.slice(0, firstSpaceIndex) : commandAndArgs;
          const args = firstSpaceIndex !== -1 ? commandAndArgs.slice(firstSpaceIndex + 1) : '';
  
          console.log('Command:', commandName);
          console.log('args:', args);
          //if (command === 'play') playCommand(message, args);
          if (!client.commands.has(commandName)) return message.reply(f`Not a real command. Use command ${prefix}help for full list of commands.`);
  
          const command = client.commands.get(commandName);
  
          try {
            command.execute(message, args, client.commands);
          } catch (error) {
            console.error(error);
            return message.reply('There was a fuck wucky executing the command.');
          }
        }
    } 
});

client.login('YOUR_BOT_TOKEN');
