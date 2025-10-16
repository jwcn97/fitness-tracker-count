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
    // TODO: do more testing on prompt
    const { from, command } = preparePrompt(msg);
    if (!command) return;

    if (msg.chat.type == 'private') {
      if (msg.from.username === 'zecoffeeaddict' && command == 'clear') {
        await userCountHandler.clear();
        await bot.sendMessage(msg.chat.id, "✅ All check-in records removed!");
      }
      return;
    }
  
    switch (command) {
      case 'increase':
        const time = new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" });
        try {
          await userCountHandler.increase(from);
          const msgToDisplay = await userCountHandler.displayUserCounts();
          await bot.sendMessage(msg.chat.id, `🏋️ You checked in at ${time}. Keep it up, ${from}!\n\n${msgToDisplay}`);
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
