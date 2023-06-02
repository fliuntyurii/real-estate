const { Scenes, Markup } = require('telegraf');

const nameSceneRenter = new Scenes.BaseScene('nameSceneRenter');
nameSceneRenter.enter((ctx) => ctx.reply('Вкажіть ваше ім\'я:'));
nameSceneRenter.on('text', (ctx) => {
  const regex = /^[a-zA-Zа-яА-Яєїіґ\s]+$/iu;
  const username = ctx.message.from.username || ctx.message.from.id;

  if(ctx.message.text.length > 30 || ctx.message.text.length < 3 || !regex.test(ctx.message.text)) {
    ctx.reply('Довжина імені 3-30 букв, не може містити символів та цифр');
    return;
  }
  ctx.session.name = ctx.message.text;
  ctx.session.username = username;
  ctx.scene.enter('ageSceneRenter');
});

const ageSceneRenter = new Scenes.BaseScene('ageSceneRenter');
ageSceneRenter.enter((ctx) => ctx.reply('Будь ласка, введіть свій вік:'));
ageSceneRenter.on('text', (ctx) => {
  const regex = /^\d+$/;

  if(Number(ctx.message.text) > 100 || Number(ctx.message.text) < 10 || !regex.test(ctx.message.text)) {
    ctx.reply('Будь ласка, введіть дійсний вік.');
    return;
  }
  ctx.session.age = ctx.message.text;
  ctx.scene.enter('budgetSceneRenter');
});

const budgetSceneRenter = new Scenes.BaseScene('budgetSceneRenter');
budgetSceneRenter.enter((ctx) => ctx.reply('Вкажіть бажану ціну за житло (грн):'));
budgetSceneRenter.on('text', (ctx) => {
  const regex = /^\d+$/;

  if(ctx.message.text < 1 || !regex.test(ctx.message.text) || ctx.message.text.length > 6) {
    ctx.reply('Бюджет не може бути пустим та повинен містити тільки цифри');
    return;
  }
  ctx.session.budget = ctx.message.text;
  ctx.scene.enter('regionSceneRenter');
});

const regionSceneRenter = new Scenes.BaseScene('regionSceneRenter');
regionSceneRenter.enter((ctx) => {
  ctx.reply('Виберіть свій район:', Markup.inlineKeyboard([
    [Markup.button.callback('Шевченківський', 'Шевченківський')],
    [Markup.button.callback('Личаківський', 'Личаківський')],
    [Markup.button.callback('Сихівський', 'Сихівський')],
    [Markup.button.callback('Франківський', 'Франківський')],
    [Markup.button.callback('Залізничний', 'Залізничний')],
    [Markup.button.callback('Галицький', 'Галицький')],
  ]));
});
regionSceneRenter.on('callback_query', (ctx) => {
  const region = ctx.update.callback_query.data;
  ctx.session.region = region;
  ctx.scene.enter('roomSceneRenter');
});

const roomSceneRenter = new Scenes.BaseScene('roomSceneRenter');
roomSceneRenter.enter((ctx) => ctx.reply('Кількість кімнат:'));
roomSceneRenter.on('text', (ctx) => {
  const rooms = ctx.message.text;
  ctx.session.rooms = rooms;
  ctx.scene.enter('floorSceneRenter');
});

const floorSceneRenter = new Scenes.BaseScene('floorSceneRenter');
floorSceneRenter.enter((ctx) => ctx.reply('Бажаний поверх:'));
floorSceneRenter.on('text', (ctx) => {
  const floor = ctx.message.text;
  ctx.session.floor = floor;
  ctx.scene.enter('animalsSceneRenter');
});

const animalsSceneRenter = new Scenes.BaseScene('animalsSceneRenter');
animalsSceneRenter.enter((ctx) => ctx.reply('Чи є у вас тварини, якщо так, то скільки та які:'));
animalsSceneRenter.on('text', (ctx) => {
  const animals = ctx.message.text;
  ctx.session.animals = animals;
  ctx.scene.enter('childrenSceneRenter');
});

const childrenSceneRenter = new Scenes.BaseScene('childrenSceneRenter');
childrenSceneRenter.enter((ctx) => ctx.reply('Скільки осіб планує проживати, діти:'));
childrenSceneRenter.on('text', (ctx) => {
  const children = ctx.message.text;
  ctx.session.children = children;
  ctx.scene.enter('conditionSceneRenter');
});

const conditionSceneRenter = new Scenes.BaseScene('conditionSceneRenter');
conditionSceneRenter.enter((ctx) => ctx.reply('Напишіть, які умови ви очікуєте (ремонт, наявність меблів та техніки тощо):'));
conditionSceneRenter.on('text', (ctx) => {
  const condition = ctx.message.text;
  ctx.session.condition = condition;
  ctx.scene.enter('contactSceneRenter');
});

const contactSceneRenter = new Scenes.BaseScene('contactSceneRenter');
contactSceneRenter.enter((ctx) => ctx.reply('Будь ласка, введіть номер для зворонього зв\'язку (формат: 050 000 1111):'));
contactSceneRenter.on('text', async (ctx) => {
  const regex = /^0\d{9}$/;

  if(!regex.test(ctx.message.text.split(' ').join(''))) {
    ctx.reply('Введіть, будь ласка, номер!');
    return;
  }
  ctx.session.contact = '+38' + ctx.message.text.split(' ').join('');

  ctx.reply(`Дякуємо, що скористались нашим сервісом! Ми зв'яжемось з Вами, як тільки підберемо житло, що співпадає вказаним критеріям!`);
  ctx.scene.enter('completeSceneRenter');
});


module.exports = {
  nameSceneRenter,
  ageSceneRenter,
  budgetSceneRenter,
  regionSceneRenter,
  contactSceneRenter,
  roomSceneRenter,
  floorSceneRenter,
  animalsSceneRenter,
  childrenSceneRenter,
  conditionSceneRenter,
};