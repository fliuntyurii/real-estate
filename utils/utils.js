const timeoutMiddleware = (timeoutDuration) => (ctx, next) => {
  if (ctx.session && ctx.session.lastInteraction) {
    clearTimeout(ctx.session.timer);
    console.log('Таймер сцени запустився.');

    const currentTime = Date.now();
    const timeSinceLastInteraction = currentTime - ctx.session.lastInteraction;

    if (timeSinceLastInteraction >= timeoutDuration) {
      console.log('Час очікування минув.');
      return ctx.scene.leave();
    }
  }

  return next();
};

module.exports = {
  timeoutMiddleware,
}