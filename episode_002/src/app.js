import Vue from 'https://unpkg.com/vue@2.6.11/dist/vue.esm.browser.js';
import getCountries from './getCountries.js';

const params = new URLSearchParams(window.location.search);

class Map {
  constructor() {
    this.data = {};
  }

  has(prop) {
    return Object.prototype.hasOwnProperty.call(this.data, prop);
  }

  set(prop, value) {
    Vue.set(this.data, prop, value);
  }

  get(prop) {
    if (Object.prototype.hasOwnProperty.call(this.data, prop)) {
      return this.data[prop];
    }
  }
}

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [params.get('channel') || 'codinggarden'],
});

const flagWidth = 78.33333;
const flagHeight = 99.2;

const app = new Vue({
  el: '#app',
  data: {
    validCountries: {
      names: new Map(),
      map: new Map(),
    },
    teams: new Map(),
    usersByUsername: new Map(),
    commandHandlers: new Map(),
  },
  computed: {
    teamsByCount() {
      return Object
        .values(this.teams.data)
        .sort((a, b) => b.count - a.count);
    },
  },
  methods: {
    update() {
      this.teamsByCount.forEach((team) => {
        team.location.x += team.velocity.x;
        team.location.y += team.velocity.y;
        if (team.location.x >= window.innerWidth - flagWidth) {
          team.location.x = window.innerWidth - flagWidth - 2;
          team.velocity.x *= -1;
        } else if (team.location.x <= 0) {
          team.location.x = 2;
          team.velocity.x *= -1;
        }

        if (team.location.y <= 0) {
          team.location.y = 2;
          team.velocity.y *= -1;
        } else if (team.location.y >= window.innerHeight - flagHeight) {
          team.location.y = window.innerHeight - flagHeight - 2;
          team.velocity.y *= -1;
        }
      });
      requestAnimationFrame(() => {
        this.update();
      });
    },
  },
  created() {
    this.update();
    getCountries()
      .then((validCountries) => {
        this.validCountries = validCountries;
        client
          .connect();
        this.commandHandlers.set('join-team', ({
          tags: {
            username,
          },
          args,
        }) => {
          const country = args.join(' ').trim().toLowerCase();
          const countryCode = validCountries.map.get(country);
          if (countryCode && !this.usersByUsername.has(username)) {
            const countryName = validCountries.names.get(countryCode);
            let team = this.teams.get(countryCode);
            if (!team) {
              team = {
                code: countryCode,
                name: countryName,
                members: new Map(),
                location: {
                  x: Math.random() * (window.innerWidth - flagWidth),
                  y: Math.random() * (window.innerHeight - flagHeight),
                },
                velocity: {
                  x: (Math.random() > 0.5 ? -1 : 1) * Math.random() * 5,
                  y: (Math.random() > 0.5 ? -1 : 1) * Math.random() * 5,
                },
              };
              this.teams.set(countryCode, team);
            }
            const user = {
              username,
              score: 0,
            };
            team.members.set(username, user);
            team.velocity.x *= 1.1;
            team.velocity.y *= 1.1;
            team.count = Object.keys(team.members.data).length;
            this.usersByUsername.set(username, user);
            console.log(username, 'joined', countryName);
          }
        });
        // this.commandHandlers.set('throw-food', (info) => {
        //   console.log(info.tags.username, info.command, info.args.join(' '));
        // });
        // this.commandHandlers.set('deploy-dolphin', (info) => {
        //   console.log(info.tags.username, info.command, info.args.join(' '));
        // });
        // this.commandHandlers.set('climb-wall', (info) => {
        //   console.log(info.tags.username, info.command, info.args.join(' '));
        // });
        // this.commandHandlers.set('nuke', (info) => {
        //   console.log(info.tags.username, info.command, info.args.join(' '));
        // });
        // this.commandHandlers.set('attend-uni', (info) => {
        //   console.log(info.tags.username, info.command, info.args.join(' '));
        // });

        /*
      !join-team us
    */

        client.on('message', (channel, tags, message, self) => {
          if (self) return;
          if (!message.startsWith('!')) return;
          const args = message.split(' ');
          const command = args.shift().slice(1);
          const commandHandler = this.commandHandlers.get(command);
          if (commandHandler) {
            commandHandler({
              command,
              tags,
              message,
              args,
            });
          }
        });
      });
  },
});
