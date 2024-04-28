"use client";

import { useEffect, useState } from "react";

const strategems = [
  { title: "Eagle 500KG Bomb", keys: "⬆️➡️⬇️⬇️⬇️" },
  { title: "Resupply", keys: "⬇️⬇️⬆️➡️" },
];

export default function Home() {
  const [pressedArrows, setPressedArrows] = useState("");
  const [foundStrategem, setFoundStrategem] = useState("");
  const [resetTimout, setrResetTimout] = useState(null);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler, false);

    return () => {
      document.removeEventListener("keydown", keyDownHandler, false);
    };
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Strategem Zero
      </h1>
      <h2>
        The
        <span className="text-blue-600 dark:text-blue-500">
          {" "}
          Open Source
        </span>{" "}
        Strategem Hero Alternative.
      </h2>

      <div id="lastStrategemDisplay" className="h-24 mt-12">
        {foundStrategem}
      </div>

      <div className="block w-full h-20 mt-12 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-5xl dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
        {pressedArrows}
      </div>
    </main>
  );

  function keyDownHandler(e: KeyboardEvent) {
    e.preventDefault();
    var updatedPressedArrows;

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
        break;
    }

    setPressedArrows(updatedPressedArrows);
    checkForStrategem(updatedPressedArrows);

    clearTimeout(resetTimout);
    setrResetTimout(
      setTimeout(() => {
        setPressedArrows("");
      }, 1500)
    );

    // todo clear if nothing can fit anymore
  }

  function checkForStrategem(input: string) {
    strategems.every((strategem) => {
      if (strategem.keys === input) {
        setFoundStrategem(strategem.title);
        document.getElementById("lastStrategemDisplay")?.classList.add("score");
        setTimeout(() => {
          document
            .getElementById("lastStrategemDisplay")
            ?.classList.remove("score");
          setFoundStrategem("");
        }, 2000);
        setPressedArrows("");
        clearTimeout(resetTimout);
        return false;
      } else {
        return true;
      }
    });
  }
}
