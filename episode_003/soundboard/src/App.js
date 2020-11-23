import { useEffect, useState } from 'react';
import tmi from 'tmi.js';

import SoundPlayer from './SoundPlayer';

import kittenUrl from './sounds/kittens.mp3';
import kissUrl from './sounds/kiss.mp3';
import hairUrl from './sounds/hair.mp3';
import printerUrl from './sounds/3d-printer.mp3';
import crowdUrl from './sounds/crowd.mp3';
import plungerUrl from './sounds/plunger.mp3';
import mummyUrl from './sounds/mummy.mp3';
import beansUrl from './sounds/beans.mp3';

const sounds = [{
  emoji: '😸',
  url: kittenUrl,
}, {
  emoji: '👄',
  url: kissUrl,
},
{
  url: hairUrl,
  emoji: '💇‍♀️',
},
{
  url: printerUrl,
  emoji: '🖨',
},
{
  url: crowdUrl,
  emoji: '🙌',
},
{
  url: plungerUrl,
  emoji: '💩',
},
{
  url: mummyUrl,
  emoji: '🧟‍♂️',
},
{
  url: beansUrl,
  emoji: '🥫',
}];

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: [ 'codinggarden' ]
});

client.connect();

function App() {
  const [audios, setAudios] = useState([]);
  const [playAudios, setPlayAudios] = useState([]);

  useEffect(() => {
    const allAudios = sounds.map(({ url }) => new Audio(url));
    setAudios(allAudios);
    const allPlayAudios = allAudios.map((audio) => () => {
      audio.currentTime = 0;
      audio.play();
    });
    setPlayAudios(allPlayAudios);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        allAudios.forEach((audio) => audio.pause());
      }
    })

    client.on('message', (channel, tags, message, self) => {
      const matches = message.match(/^!play ([1-8])$/);
      if (matches) {
        const num = matches[1] - 1;
        if (allPlayAudios[num]) {
          console.log(tags.username, sounds[num].emoji);
          allPlayAudios[num]();
        }
      }
    });
  }, []);

  return (
    <div className="sound-buttons">
      {sounds.map((sound, i) => (
        <SoundPlayer key={sound.emoji} emoji={`${i + 1}: ${sound.emoji}`} playSound={playAudios[i]} />
        // <SoundPlayer key={sound.url} {...sound} />
      ))}
    </div>
  );
}

export default App;
