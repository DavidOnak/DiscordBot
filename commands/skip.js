const { skipSong } = require('../musicQueue');

module.exports = {
  name: 'skip',
  description: 'Skip the current song',
  execute(message) {
    skipSong(message);
  },
};