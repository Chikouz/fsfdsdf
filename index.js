const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const { keepAlive } = require("./keep_alive");
keepAlive();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const DATA_FILE = "database.json";

// 🗂️ تحميل و حفظ البيانات
function loadPoints() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function savePoints(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 🟢 عند تشغيل البوت
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  const data = loadPoints();

  // 🎮 !gcubes — عرض نقاط المستخدم أو شخص آخر
  if (cmd === "!gcubes") {
    let member = message.mentions.users.first() || message.author;
    const userId = member.id;
    const points = data[userId] || 0;

    return message.reply({
      content: `💎 ${member.username} has ${points} GCubes.`,
    });
  }

  // ➕➖ أوامر إضافة / إزالة GCubes (للمدراء فقط)
  if (
    (cmd === "!addgcubes" || cmd === "!removegcubes") &&
    message.member.permissions.has("Administrator")
  ) {
    const member = message.mentions.members.first();
    const amount = parseInt(args[1]);

    if (!member || isNaN(amount)) {
      return message.reply("❗ Usage: !addgcubes @user 10");
    }

    const userId = member.id;
    data[userId] = data[userId] || 0;

    if (cmd === "!addgcubes") {
      data[userId] += amount;
      message.reply(`✅ Added ${amount} GCubes to ${member.user.username}`);
    } else {
      data[userId] = Math.max(0, data[userId] - amount);
      message.reply(`✅ Removed ${amount} GCubes from ${member.user.username}`);
    }

    savePoints(data);
  }

  // 📜 !help — يعرض الأوامر حسب الصلاحية
  if (cmd === "!help") {
    let helpMessage = `📘 **Available Commands**\n`;
    helpMessage += `• \`!gcubes [@user]\` - View your or someone's GCubes 💎\n`;

    if (message.member.permissions.has("Administrator")) {
      helpMessage += `• \`!addgcubes @user amount\` - Add GCubes ✅\n`;
      helpMessage += `• \`!removegcubes @user amount\` - Remove GCubes ❌\n`;
    }

    return message.reply(helpMessage);
  }
});

// 🟡 تشغيل الخادم وحفظ البوت من الإيقاف
keepAlive();
client.login(TOKEN);
