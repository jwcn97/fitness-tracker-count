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
    if (msg.chat.type == 'private') {
      return;
    }

    const { from, command } = preparePrompt(msg);
    if (!command) return;
    // console.log('\nCOMMAND:', command, '\nPROMPT:', prompt);
  
    switch (command) {
      case 'increase':
        const time = new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" });
        try {
          await userCountHandler.increase(from);
          await bot.sendMessage(msg.chat.id, `🏋️ You checked in at ${time}. Keep it up, ${from}!`);
        } catch (err) {
          console.error(err);
          await bot.sendMessage(msg.chat.id, "⚠️ Could not record your check-in. Please try again later.");
        }
        break;
      case 'display':
        const msgToDisplay = await userCountHandler.displayUserCounts();
        await bot.sendMessage(msg.chat.id, msgToDisplay || "No check-ins yet.");
        break;
      case 'default':
        break;
      default:
        break;
    }
});
