import type { Message } from 'node-telegram-bot-api';

const BOT_USERNAME = '@fitness_tracker_count_test_bot';

export function preparePrompt({ text, from, entities = [] }: Message): {
  from?: string;
  command?: string;
  prompt?: string;
} {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    // bot-commands
    if (entity.type === 'bot_command') {
      return {
        from: from.username,
        command: text
          .slice(entity.offset + 1, entity.offset + entity.length)
          .replace(BOT_USERNAME, ''),
        prompt:
          text.substring(0, entity.offset) +
          text.substring(entity.offset + 1).replace(BOT_USERNAME, ''),
      };
    }
  }
  // invalid commands
  return {};
}
