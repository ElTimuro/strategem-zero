"use client";

import { useEffect, useState } from "react";
import { usePlausible } from "next-plausible";
import strategems from "../../public/strategems.json";

export default function Home() {
  const plausible = usePlausible();
  const [pressedArrows, setPressedArrows] = useState("");
  const [foundStrategem, setFoundStrategem] = useState("");
  const [inputTimeout, setInputTimeout] = useState<any>();
  const [foundTimeout, setFoundTimeout] = useState<any>();
  const [score, setScore] = useState(0);
  const [roundNr, setRoundNr] = useState(0);
  const [roundTime, setRoundTime] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);
  // todo strategem type
  const [roundGoals, setRoundGoals] = useState<any[]>([]);

  // todo save highscore on global leaderboard

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler, false);

    return () => {
      document.removeEventListener("keydown", keyDownHandler, false);
    };
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <a className="mt-4" href="https://github.com/ElTimuro/strategem-zero">
        <img
          src="https://img.shields.io/github/stars/ElTimuro/strategem-zero"
          alt="Github Stars"
        />
      </a>

      <div id="lastStrategemDisplay" className="h-24 mt-2">
        {foundStrategem}
      </div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        -- 💥 Strategem Zero 💀 --
      </h1>
      <h2 className="text-lg">
        The
        <span className="text-yellow-600 dark:text-yellow-500">
          {" "}
          Open Source
        </span>{" "}
        Strategem Hero Alternative.
      </h2>
      {roundNr > 0 && (
        <div id="roundNr" className="score">
          Round: {roundNr}
        </div>
      )}
      {roundNr > 0 && (
        <div id="score" className="score">
          Score: {score}
        </div>
      )}
      {roundNr > 0 && (
        <div id="score" className="score">
          Time: {roundTime}
        </div>
      )}
      {roundNr > 0 && (
        <div id="score" className="text-5xl mt-12 flex flex-col items-center">
          <div className="p-2"> {roundGoals[0]?.title}</div>
          <div className="p-2">{roundGoals[0]?.keys}</div>
        </div>
      )}
      {roundNr < 1 && (
        <p className="text-lg mt-12">Presss [W] [A] [S] [D] key to play....</p>
      )}
      {roundNr === -1 && (
        <div id="score" className="text-7xl mt-24">
          GAME OVER! FINAL SCORE: {score}
        </div>
      )}

      <div className="text-8xl mt-12">{pressedArrows}</div>
    </main>
  );

  function keyDownHandler(e: KeyboardEvent) {
    e.preventDefault();
    let updatedPressedArrows = "";

    if (roundNr < 1) {
      startRound(1);
      return;
    }

    switch (e.key) {
      case "w":
        setDisplayedStrategem("lorem");
        updatedPressedArrows = pressedArrows + "⬆️";
        break;

      case "a":
        updatedPressedArrows = pressedArrows + "⬅️";
        break;

      case "s":
        updatedPressedArrows = pressedArrows + "⬇️";
        break;

      case "d":
        updatedPressedArrows = pressedArrows + "➡️";
        break;

      default:
        break;
    }

    setPressedArrows(updatedPressedArrows);
    checkForStrategem(updatedPressedArrows);
    if (inputTimeout !== null) clearTimeout(inputTimeout);
    setInputTimeout(
      setTimeout(() => {
        setPressedArrows("");
      }, 1500)
    );

    // todo dont trigger is more is possible and wait for timeout (currently 2 strategems blocked)
    // todo clear if nothing can fit anymore
  }

  // todo stage ending with points
  // todo changing stage difficulty etc. ?
  function startRound(roundNr: number) {
    if (roundNr === 1) setScore(0);
    setRoundNr(roundNr);
    setRoundGoals(generateRoundGoals(roundNr));
    setRoundTime(20);
    clearInterval(timerIntervalId);
    const intervalId = setInterval(() => {
      setRoundTime((prevRoundTime) => {
        if (prevRoundTime === 0) {
          clearInterval(intervalId);
          gameOver();
          return 0;
        }

        return prevRoundTime - 1;
      });
    }, 1000);

    setTimerIntervalId(intervalId);
  }

  function generateRoundGoals(roundNr: number): any[] {
    let goals = [];

    for (let i = 0; i < 5; i++) {
      goals.push(strategems[randomIntFromInterval(0, strategems.length - 1)]);
    }

    return goals;
  }

  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function checkForStrategem(input: string) {
    // todo count fails: fail on time clear or fail on wrong key
    if (roundGoals[0]?.keys === input) {
      clearInput();
      updateScore(roundGoals[0]);
      const updatedRoundGoals: any[] = JSON.parse(JSON.stringify(roundGoals));
      updatedRoundGoals.shift();
      console.log(updatedRoundGoals.length);
      if (updatedRoundGoals.length === 0) {
        console.log("start round: " + roundNr);
        startRound(roundNr + 1);
      } else {
        setRoundGoals(updatedRoundGoals);
      }

      clearDisplayedStrategem();
      clearInput();
      return false;
    }

    // 16 since emojis count 2
    if (input.length === 16) clearInput();

    return true;
  }

  function updateScore(strategem: { title: string; keys: string }) {
    // todo time bonus
    const scoreElement = document.getElementById("score");
    scoreElement?.classList.remove("score");
    setScore(score + strategem.keys.length * roundNr);

    setTimeout(() => {
      scoreElement?.classList.add("score");
    }, 1);
  }

  function clearInput() {
    setPressedArrows("");
  }

  // refactor to generic pop message
  function setDisplayedStrategem(title: string) {
    const display = document.getElementById("lastStrategemDisplay");
    setFoundStrategem("");
    display?.classList.remove("score");
    setFoundStrategem(title);
    setTimeout(() => {
      display?.classList.add("score");
    }, 1);

    clearDisplayedStrategem();
  }

  function clearDisplayedStrategem() {
    clearTimeout(foundTimeout);
    setFoundTimeout(
      setTimeout(() => {
        setDisplayedStrategem("");
        document
          .getElementById("lastStrategemDisplay")
          ?.classList.remove("score");
      }, 2000)
    );
  }

  function gameOver() {
    clearInput();
    setRoundNr(-1);
  }
}
