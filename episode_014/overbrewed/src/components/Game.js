import { useEffect, useState } from 'react';
import styles from './Game.module.css';

import Ingredients from './Ingredients';
import CoffeeCup from './CoffeeCup';
import OrderBox from './OrderBox';

const backgroundSound = new Audio('https://freesound.org/data/previews/423/423689_3589115-hq.mp3');
backgroundSound.loop = true;
backgroundSound.volume = 0.5;
const wrongSound = new Audio('https://freesound.org/data/previews/278/278164_5324223-hq.mp3');
const gameOverSound = new Audio('https://freesound.org/data/previews/382/382310_5421751-hq.mp3');
const orderReadySound = new Audio('https://freesound.org/data/previews/149/149269_1083532-hq.mp3');

const ingredients = [
  {
    name: "Coffee",
    background: "#8D5B4C",
  },
  {
    name: "Espresso",
    background: "#0D0C1D",
  },
  {
    name: "Water",
    background: "#C2D6EB",
  },
  {
    name: "Ice",
    background: "#6699CC",
  },
  {
    name: "Milk",
    background: "#D8BFAA",
  },
  {
    name: "Foam",
    background: "#F2D0A4",
  },
  {
    name: "Sugar",
    background: "#FAFAFF",
  },
  {
    name: "Mud",
    background: "#99582A",
  },
];

const getRandomOrder = () => {
  const order = [];
  const numIngredients = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numIngredients; i++) {
    const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    order.push({
      ...randomIngredient,
    });
  }
  return order;
};

const Game = () => {
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [gameEnd, setGameEnd] = useState(new Date());
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [badRecipe, setBadRecipe] = useState(false);
  const [currentOrder, setCurrentOrder] = useState([{
    name: 'NO ORDER YET',
  }]);
  const [selectedIngredient, setSelectedIngredient] = useState(-1);
  const [currentIngredients, setCurrentIngredients] = useState([]);

  useEffect(() => {
    const listener = (event) => {
      if (!started || gameOver) {
        if (event.key === ' ') {
          backgroundSound.play();
          setScore(0);
          setGameOver(false);
          setStarted(true);
          setSelectedIngredient(0);
          setCurrentOrder(getRandomOrder());
          setGameEnd(Date.now() + (62 * 1000));
          setSecondsLeft(62);
        }
      }
      if (started) {
        if (event.key === 'ArrowRight') {
          setSelectedIngredient((prevValue) => {
            const nextIndex = prevValue + 1;
            return nextIndex >= ingredients.length ? 0 : nextIndex;
          });
        } else if (event.key === 'ArrowLeft') {
          setSelectedIngredient((prevValue) => {
            const nextIndex = prevValue - 1;
            return nextIndex < 0 ? ingredients.length - 1 : nextIndex
          })
        } else if (event.key === 'Enter') {
          setCurrentIngredients((prevValue) => [...prevValue, {
            id: Date.now(),
            ...ingredients[selectedIngredient],
          }]);
        }
      }
    };
    if (!badRecipe) {
      document.addEventListener('keydown', listener);
    }
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [gameOver, started, badRecipe, selectedIngredient]);

  useEffect(() => {
    if (currentIngredients.length) {
      for (let i = 0; i < currentIngredients.length; i++) {
        if (currentOrder[i].name !== currentIngredients[i].name) {
          setTimeout(() => {
            setBadRecipe(false);
            setCurrentIngredients([]);
          }, 2000);
          wrongSound.currentTime = 0;
          wrongSound.play();
          setScore((prevValue) => prevValue - currentOrder.length);
          setGameEnd((prevValue) => prevValue - (currentOrder.length * 1000));
          return setBadRecipe(true);
        }
      }
      if (currentIngredients.length === currentOrder.length) {
        setTimeout(() => {
          if (!gameOver) {
            setScore((prevValue) => prevValue + currentOrder.length);
            setBadRecipe(false);
            setCurrentIngredients([]);
            setCurrentOrder(getRandomOrder());
          }
        }, 1000);
        orderReadySound.currentTime = 0;
        orderReadySound.play();
        return setBadRecipe(true);
      }
    }
  }, [currentOrder, gameOver, currentIngredients]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let seconds = Math.round((gameEnd - Date.now()) / 1000);
      if (seconds <= 0) {
        seconds = 0;
        if (started) {
          clearInterval(intervalId);
          setGameOver(true);
          setCurrentOrder([{
            name: 'GAME OVER!',
          }]);
          gameOverSound.currentTime = 0;
          gameOverSound.play();
        }
      }
      setSecondsLeft(seconds);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameEnd, started]);

  return (
    <div className={styles.game}>
      <img alt="background" className={styles.background} src="https://64.media.tumblr.com/90e492ee0cadaa2289e8d7287c22b122/tumblr_pa5l001s051u0zmo4o1_1280.gif" />
      <div className={styles.gamePerspective}>
        {started && !gameOver && <div className={styles.gameInfo}>
          <div>Score: {score}</div>
          <div>Time Remaining: {secondsLeft}</div>
        </div>}
        {gameOver && <div className={styles.gameInfo}>
          <div>GAME OVER!</div>
          <div>You scored: {score}</div>
          <div>PRESS SPACE TO PLAY AGAIN.</div>
        </div>}
        {started && !gameOver && <Ingredients badRecipe={badRecipe} ingredients={ingredients} selectedIngredient={selectedIngredient} />}
        <CoffeeCup ingredients={currentIngredients} />
        <OrderBox gameOver={gameOver} ingredients={currentIngredients} order={currentOrder} />
        {!started && <div className={styles.startButton}>PRESS SPACE TO START</div>}
      </div>
    </div>
  );
};

export default Game;
