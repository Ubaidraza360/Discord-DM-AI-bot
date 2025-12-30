import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import fetch from 'node-fetch';

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;

async function askGemini(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$AIzaSyDbIsBkS9mGJW5QcFoag8vFAudV7ShMF18`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }]
      })
    }
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Kuch ghalat ho gaya 😅";
}

client.on('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (msg.guild) return;

  try {
    await msg.channel.sendTyping();
    const reply = await askGemini(msg.content);
    await msg.reply(reply.slice(0, 1900));
  } catch (err) {
    console.error(err);
    msg.reply("Error aa gaya bhai 😅");
  }
});

client.login(DISCORD_TOKEN);
