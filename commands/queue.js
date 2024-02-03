const { viewQueue } = require('../musicQueue');

module.exports = {
  name: 'queue',
  description: 'View the current queue',
  execute(message) {
    viewQueue(message);
  },
};