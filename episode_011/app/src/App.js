import { useEffect, useState, useCallback } from "react";
import * as Tone from "tone";
import WebMidi from "webmidi";

import styles from "./App.module.css";
import pawImage from './assets/kitten-paw.png';

const keyboardKeysToNote = {
  A: "C4",
  S: "D4",
  D: "E4",
  F: "F4",
  G: "G4",
  H: "A4",
  J: "B4",
};

let playNote = () => {};

function App() {
  const [mouseLocation, setMouseLocation] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const samplerInstance = new Tone.Sampler({
      urls: {
        C4: "meow-C.mp3",
      },
      baseUrl: "/",
      onload: () => {
        playNote = (note) => {
          const now = Tone.now();
          samplerInstance.triggerAttackRelease(note, "8n", now);
        };
      },
    }).toDestination();

    const keyDown = (event) => {
      const key = event.key.toUpperCase();
      if (keyboardKeysToNote[key]) {
        playNote(keyboardKeysToNote[key]);
      }
    };
    const mouseMove = (event) => {
      setMouseLocation({
        x: event.clientX,
        y: event.clientY,
      });
    };
    document.addEventListener("keydown", keyDown);
    document.addEventListener("mousemove", mouseMove);

    WebMidi.enable(function (err) {
      console.log('Midi inputs:', WebMidi.inputs);
      if (WebMidi.inputs.length) {
        const [input] = WebMidi.inputs;
        input.addListener('noteon', "all",
          (e) => {
            const note = e.note.name + e.note.octave;
            console.log(note);
            playNote(note);
          },
        );
      }
    });
    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <>
      <div className={styles.keyboard}>
        <div onClick={() => playNote("C4")} className={styles.key}>
          C
        </div>
        <div onClick={() => playNote("D4")} className={styles.key}>
          D
        </div>
        <div onClick={() => playNote("E4")} className={styles.key}>
          E
        </div>
        <div onClick={() => playNote("F4")} className={styles.key}>
          F
        </div>
        <div onClick={() => playNote("G4")} className={styles.key}>
          G
        </div>
        <div onClick={() => playNote("A4")} className={styles.key}>
          A
        </div>
        <div onClick={() => playNote("B4")} className={styles.key}>
          B
        </div>
      </div>
      <img
        style={{ top: `${mouseLocation.y}px`, left: `${mouseLocation.x}px` }}
        className={styles.paw}
        alt="paw"
        src={pawImage}
      />
    </>
  );
}

export default App;
