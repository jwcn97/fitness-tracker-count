import type { Message } from 'node-telegram-bot-api';

const BOT_USERNAME = `@${process.env.BOT_NAME}`;

export function preparePrompt({ text, from, entities = [] }: Message): {
  from?: string;
  command?: string;
  prompt?: string;
} {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    // bot-commands
    if (entity.type === 'bot_command') {
      const command = text
        .slice(entity.offset + 1, entity.offset + entity.length)
        .replace(BOT_USERNAME, '');
      
      const prompt = (text.substring(0, entity.offset) + text.substring(entity.offset + 1)
        .replace(BOT_USERNAME, ''))
        .replace(command, '')
        .trim();

      return {
        from: from.username,
        command,
        prompt,
      };
    }
  }
  // invalid commands
  return {};
}

export function getQuarterRange(input?: string) {
  let year: number;
  let qNum: number;

  if (!input) {
    // 🕐 No input given — use current date
    const now = new Date();
    year = now.getUTCFullYear();
    qNum = Math.floor(now.getUTCMonth() / 3) + 1; // 0–2 = Q1, 3–5 = Q2, etc.
  } else {
    // 📦 Input provided, e.g. "Q2-2025"
    const [q, yearStr] = input.split("-");
    year = parseInt(yearStr?.length === 2 ? `20${yearStr}` : yearStr);
    qNum = parseInt(q.toUpperCase().replace("Q", ""));
  }

  const startMonth = (qNum - 1) * 3;
  const start = new Date(Date.UTC(year, startMonth, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, startMonth + 3, 0, 23, 59, 59));

  return { start, end, quarterLabel: `Q${qNum}-${year}` };
}
