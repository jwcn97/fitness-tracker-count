import * as dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';
import { preparePrompt } from './utils';
import type { Message } from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', async (msg: Message) => {  
    const { command, prompt } = preparePrompt(msg);
    if (!command) return;
    console.log('\nCOMMAND:', command, '\nPROMPT:', prompt);
  
    switch (command) {
      // TODO: add more command cases to handle
      case 'default':
        break;
      default:
        break;
    }
});
