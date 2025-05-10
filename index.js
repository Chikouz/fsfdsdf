const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// لمنع Glitch من إيقاف المشروع
app.get("/", (req, res) => res.send("✅ Bot is alive!"));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// بوت ديسكورد
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.on("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", message => {
  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }
});

client.login(process.env.TOKEN);

