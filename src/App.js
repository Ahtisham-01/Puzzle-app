import logo from "./logo.svg";
import Grid from "./PuzzleGrid";
import Modal from "./Modal";
import React, { useState, useEffect } from "react";
function App() {
  const [puzzleSize, setSize] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const onValueChange = (e) => {
    setInputValue(e.target.value);
  };
  const modalStateHandler = () => {
    document.querySelector(".modal").classList.remove("flex");
    document.querySelector(".modal").classList.add("hidden");
    setModalState(false);
    setSizeToLocalStorage(0);
    setSize(0);
  };
  const setSizeToLocalStorage = (puzzleSize) => {
    localStorage.setItem("puzzleSize", JSON.stringify(puzzleSize));
  };

  const getSizeFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("puzzleSize"));
  };

  useEffect(() => {
    const localSize = getSizeFromLocalStorage();
    if (!localSize) return;
    setSize(localSize);
  });

  const onFormSubmit = (e) => {
    e.preventDefault();
    setSizeToLocalStorage(e.target[0].value);
    setSize(e.target[0].value);
  };

  const getGrid = () => {
    return (
      <Grid
        puzzleSize={puzzleSize}
        gameCompleted={() => {
          setModalState(true);
        }}
      />
    );
  };
  return (
    <div className="w-full p-7  h-screen  ">
      <div className="w-full  p-4  border border-zinc-300 bg-zinc-50 rounded-md">
	  <img className='flex justify-center items-center w-54 object-cover h-24 rounded-md' src='https://tuk-cdn.s3.amazonaws.com/can-uploader/Screenshot_2022-11-03_011620-removebg-preview.png' />
        <div className="w-full flex justify-center">
          <label className="font-extrabold text-4xl px-4  shadow-xl mr-2 py-4 text-zinc-900">
            PUZZLE APP
          </label>
        </div>

        <div className="p-3 w-full mt-8 flex justify-center items-center ">
          <form
            onSubmit={(e) => {
              localStorage.clear();
              onFormSubmit(e);
              setInputValue("");
            }}
          >
            <label className="font-bold text-xl mr-2 text-zinc-500">
              ENTER PUZZLE SIZE OF GRID :
            </label>
            <input
              placeholder="Enter Puzzle Size"
              className="input-1  border border-zinc-500 outline-none h-12 w-80 p-4 shadow-xl rounded-lg"
              value={inputValue}
              type="number"
              min={2}
              max={6}
              onChange={onValueChange}
            />
            <button className="bg-zinc-900 box-border shadow-xl rounded-lg hover:text-zinc-900 text-white hover:bg-text-zinc-900 font-semibold hover:bg-zinc-300 ml-1.5 w-24 h-12 p-1">
              Create
            </button>
          </form>
        </div>
        <br />
        <Modal modalState={modalStateHandler} state={modalState} />

        <div className="h-full">{getGrid()}</div>
      </div>
    </div>
  );
}

export default App;
