const ytdl = require('ytdl-core');
const play = require('play-dl');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const queue = [];

// Will add song to queque, if queque is empty, the song will instantly be played
async function addToQueue(message, input) {
    const voiceChannel = message.member.voice.channel;
    if (voiceChannel === undefined) return message.reply('You need to be in a voice channel to play music!');
  
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.reply('I need permissions to join and speak in your voice channel!');

    try {
        const videoInfo = await getYouTubeInfo(input);
        console.log('Valid YouTube URL:', videoInfo.url);
        console.log('Video Title:', videoInfo.title);
    
        queue.push(videoInfo)
    
        if (queue.length === 1) {
            playNextSong(message, true);
        } else {
            message.reply('Added to the queue: '+videoInfo.title)
        }
    } catch {
        console.error('Error adding to queue:', error.message);
        message.reply('Whoops I had a fucky wucky trying to add that to queue.');
    }
}

// Removes current song from queue and starts play for next song
function skipSong(message) {
    if (queue.length > 0) {
        message.reply(`Skipping: ${queue[0].title}`);
        queue.shift();
        playNextSong(message, false);
      } else {
        message.reply('Queue is empty.');
      }
}

// Returns the list of titles for songs in the queue
function viewQueue(message) {
    if (queue.length > 0) {
        const queueList = queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
        message.reply(`Queue:\n${queueList}`);
      } else {
        message.reply('Queue is empty.');
      }
}

// Will play the next song on the queue, at end current song will get dumped from queque and next song will begin
async function playNextSong(message, startOfQueue) {
    const currentSong = queue[0];

    if (currentSong) {
        try {
            const stream = await play.stream(currentSong.url);
            const resource = createAudioResource(stream.stream, { inputType: stream.type });

            // Configure the player and set it up to play next song on finish
            const player = createAudioPlayer();
            player.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio player has started playing!');
            });
            player.on('error', error => {
                console.error(`Error: ${error.message} with resource`);
            });
            player.on(AudioPlayerStatus.Idle, () => {
                queue.shift();
                playNextSong(message, false);
            });
            
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
        
            player.play(resource);
            connection.subscribe(player);
            
            // Only reply directly to message if first song is playing, otherwise just send normal message to the channel that last gave a command
            if (startOfQueue) message.reply("Now playing: " + currentSong.title);
            else message.channel.send("Now playing: " + currentSong.title);
        } catch (error) {
            console.error('Error:', error.message);
            message.reply('Whoops! I had a fucky wucky trying to play the video on YouTube!');
        }
    }
}

// Will return a valid url for youtube taking in a string
async function getYouTubeInfo(input) {
    try {
      // Check if the input is a valid YouTube URL
      if (ytdl.validateURL(input)) {
        const info = await ytdl.getInfo(input);
        return { url: input, title: info.videoDetails.title };
      }

      // If not a URL, perform a search and get the first result
      const searchResults = await play.search(input, { limit: 1 });
      if (searchResults.length === 0) {
        throw new Error('No search results found.');
      }
  
      // Return the URL and title of the first search result
      return { url: searchResults[0].url, title: searchResults[0].title };
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
}

module.exports = {
    addToQueue,
    skipSong,
    viewQueue,
    playNextSong,
  };