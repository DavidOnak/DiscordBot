module.exports = {
    name: 'help',
    description: 'Show available commands',
    execute(message, args, commands) {
        const commandList = [];

        commands.forEach(command => {
            commandList.push(`**${command.name}**: ${command.description}`);
        });

        message.reply(`Available Commands:\n${commandList.join('\n')}`);
        },
  };