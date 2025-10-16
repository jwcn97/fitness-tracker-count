import * as dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';
import { UserCountHandler } from './userCountHandler';
import { preparePrompt } from './utils';
import type { Message } from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const userCountHandler = new UserCountHandler();

bot.setMyCommands(
  [
    {
      command: '/increase',
      description: 'Increase Count',
    },
    {
      command: '/decrease',
      description: 'Decrease Count',
    },
    {
      command: '/display',
      description: 'Display Count',
    }
  ],
  {
    scope: {
      type: 'all_private_chats',
    },
  }
);

bot.on('message', async (msg: Message) => {
    const { from, command, prompt } = preparePrompt(msg);
    if (!command) return;
    console.log('\nCOMMAND:', command, '\nPROMPT:', prompt);
  
    switch (command) {
      case 'increase':
        userCountHandler.increase(from);
        break;
      case 'decrease':
        userCountHandler.decrease(from);
        break;
      case 'display':
        await bot.sendMessage(msg.chat.id, userCountHandler.displayUserCounts());
        break;
      case 'default':
        break;
      default:
        break;
    }
});
