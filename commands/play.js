const { addToQueue } = require('../musicQueue');

module.exports = {
  name: 'play',
  description: 'Add a song to the queue',
  execute(message, arg) {
    addToQueue(message, arg);
  },
};