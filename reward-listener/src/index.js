const TwitchPS = require('twitchps');

require('dotenv').config();

const init_topics = [
  {
    topic: `channel-points-channel-v1.${process.env.CHANNEL_ID}`,
    token: process.env.TWITCH_TOKEN,
  },
];

const pubSub = new TwitchPS({
  init_topics,
  reconnect: true,
  debug: false,
});

const redemptions = [];

pubSub.on('channel-points', async (data) => {
  if (data.redemption && data.redemption.reward.id === process.env.REWARD_ID) {
    const { redemption } = data;
    const info = {
      username: redemption.user.display_name || redemption.user.login,
      user_input: redemption.user_input,
    };
    console.log(info);
    redemptions.push(info);
  }
});

process.on('SIGINT', () => {
  console.log('');
  console.log(
    redemptions
      .map(({ username, user_input }) => `* [ ] ${username} - ${user_input}`)
      .join('\n'),
  );
  process.exit();
});
