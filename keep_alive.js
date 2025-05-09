const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

function keepAlive() {
  const port = process.env.PORT || 3000; // استخدام المنفذ من البيئة أو المنفذ 3000
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is already in use. Trying another one...`);
      // إذا كان المنفذ 3000 مستخدمًا، يمكنك تجربة منفذ آخر
      app.listen(4000, () => {
        console.log('✅ Server is now running on port 4000');
      });
    } else {
      console.log('❌ Error starting server:', err);
    }
  });
}

module.exports = { keepAlive };
