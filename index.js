const { Telegraf, Scenes, session } = require('telegraf');
const express = require('express');
const { nameSceneRenter, 
  ageSceneRenter, 
  budgetSceneRenter, 
  regionSceneRenter, 
  contactSceneRenter, 
  roomSceneRenter,
  floorSceneRenter,
  animalsSceneRenter,
  childrenSceneRenter,
  conditionSceneRenter,
} = require('./scenes/scenes');
require('dotenv').config()

const app = express();
const bot = new Telegraf(
  process.env.BOT_TOKEN,
  { polling: true }
);

const completeSceneRenter = new Scenes.BaseScene('completeSceneRenter');
completeSceneRenter.enter(ctx => {
  const date = new Date().toJSON();
  const day = date.split('T')[0];
  const hour = date.split('T')[1].split('.')[0]

  const { name, age, budget, region, contact, rooms, floor, animals, children, condition, username } = ctx.session;
  const message = 
    `Дані орендаря:\n\nІм'я: ${name}\nВік: ${age}\nРайон: ${region}\nБюджет: ${budget} UAH\nК-ть кімнат: ${rooms}\nПоверх: ${floor}\nТварини: ${animals}\nПроживатимуть: ${children}\nУмови: ${condition}\nНомер: ${contact}\nДата: ${day} ${hour}\n#пошук_оренди @${username}`;

  bot.telegram.sendMessage(process.env.CHAT_ID, message);
  ctx.scene.leave();
});

const stage = new Scenes.Stage([
  nameSceneRenter,
  ageSceneRenter, 
  budgetSceneRenter, 
  regionSceneRenter, 
  contactSceneRenter, 
  completeSceneRenter,
  roomSceneRenter,
  floorSceneRenter,
  animalsSceneRenter,
  childrenSceneRenter,
  conditionSceneRenter,
]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  console.log(`${ctx.from.username || 'User'} start bot.`)
  ctx.scene.leave();
  ctx.reply(`Вас вітає команда з пошуку житла!\nЗалиште заявку і ми підберемо якомога швидше найкращий для Вас варіант.\n/search`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

bot.command('search', ctx => {
  ctx.scene.leave();
  const userId = ctx.from.id;
  console.log(`${ctx.from.username || 'User'} search.`)

  if (session[userId]) {
    const lastUsageTime = session[userId].lastUsageTime;
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastUsageTime;

    if (elapsedTime < 15 * 60 * 1000) {
      const remainingTime = Math.ceil((15 * 60 * 1000 - elapsedTime) / (60 * 1000));
      ctx.reply(`Ви можете використовувати команду /search через ${remainingTime} хвилин.`);
      return;
    }
  }

  session[userId] = {
    lastUsageTime: Date.now(),
  };

  ctx.scene.enter('nameSceneRenter');
});

bot.launch();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});