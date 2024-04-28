"use client";

import { useEffect, useState } from "react";
import PlausibleProvider from "next-plausible";
import { usePlausible } from "next-plausible";
import strategems from "../../public/strategems.json";

export default function Home() {
  const plausible = usePlausible();
  const [pressedArrows, setPressedArrows] = useState("");
  const [foundStrategem, setFoundStrategem] = useState("");
  const [inputTimeout, setInputTimeout] = useState<any>();
  const [foundTimeout, setFoundTimeout] = useState<any>();
  const [found, setFound] = useState<string[]>([""]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler, false);

    return () => {
      document.removeEventListener("keydown", keyDownHandler, false);
    };
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {score > 0 && <div className="score">{score}</div>}
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
      <p className="text-lg mt-12">Presss [W] [A] [S] [D] to play.</p>

      <div id="lastStrategemDisplay" className="h-24 mt-12">
        {foundStrategem}
      </div>

      <div className="text-8xl mt-12">{pressedArrows}</div>
    </main>
  );

  function keyDownHandler(e: KeyboardEvent) {
    e.preventDefault();
    let updatedPressedArrows = "";

    switch (e.key) {
      case "w":
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
        // unessesary, but good to be explicit, since this clears the input
        updatedPressedArrows = "";
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

  function checkForStrategem(input: string) {
    strategems.every((strategem) => {
      if (strategem.keys === input) {
        plausible("foundStrategem");
        setFoundStrategem("");
        document
          .getElementById("lastStrategemDisplay")
          ?.classList.remove("score");
        setFoundStrategem(strategem.title);
        setTimeout(() => {
          document
            .getElementById("lastStrategemDisplay")
            ?.classList.add("score");
          if (found.indexOf(strategem.title) === -1) {
            setScore(score + 1);
          }

          setFound(found.concat(strategem.title));
        }, 1);

        clearTimeout(foundTimeout);
        setFoundTimeout(
          setTimeout(() => {
            setFoundStrategem("");
            document
              .getElementById("lastStrategemDisplay")
              ?.classList.remove("score");
          }, 2000)
        );

        setPressedArrows("");
        return false;
      } else {
        // 16 since emojis count 2
        if (input.length === 16) setPressedArrows("");
        return true;
      }
    });
  }
}
