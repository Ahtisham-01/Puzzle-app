import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function PuzzleImage() {
    //Set value for input field
    const [value, setValue] = useState(null);
    //Modal state to show when win
    const [modalState, setModalState] = useState(false);
    const [loader, setLoader] = useState(false);
    const [toaster, setToaster] = useState(false);
    const notify = () => toast("Congratulation you win!");
    //images state
    const [immage, setImg] = useState("");
    const img = new Image();
    const imgArr = [
        // {
        //     id: 1,
        //     img: "https://tuk-cdn.s3.amazonaws.com/can-uploader/haunted-img.png",
        // },
        {
            id: 1,
            img: "https://tuk-cdn.s3.amazonaws.com/can-uploader/auto-g4fcd3802d_640.jpg",
        },
        {
            id: 2,
            img: "https://tuk-cdn.s3.amazonaws.com/can-uploader/superhero-gaac3247e5_640.jpg",
        },
        {
            id: 3,
            img: "https://tuk-cdn.s3.amazonaws.com/can-uploader/superhero-gaac3247e5_640.jpg",
        },
        {
            id: 4,
            img: "https://tuk-cdn.s3.amazonaws.com/can-uploader/haunted-house-gca0115db6_640.jpg",
        },
    ];
    //modal Handler
    const modalStateHandler = () => {
        document.querySelector(".modal").classList.remove("flex");
        document.querySelector(".modal").classList.add("hidden");
        setModalState(false);
        setValue(null);
        document.getElementById("GridSize").value = "";
    };
    function images() {
        setImg("");
        let randomNu = Math.floor(Math.random() * 4) + 1;
        console.log(randomNu);
        let i = imgArr.find((it) => {
            if (it.id == randomNu) {
                return it;
            }
        });
        if (i !== undefined) {
            setImg(i);
        }
    }
    useEffect(() => {
        if (toaster === true) {
            notify();
        }
    }, [toaster]);

    useEffect(() => {
        images();
    }, []);
    useEffect(() => {
        canvas();
    }, [value]);
    //creating canvas
    const canvas = () => {
        const PUZZLE_HOVER_TINT = "#009900";

        const canvas = document.querySelector("#canvas");
        const stage = canvas.getContext("2d");
        let difficulty = value;
        let pieces;
        let piece;
        let puzzleWidth;
        let puzzleHeight;
        let pieceWidth;
        let pieceHeight;
        let currentPiece;
        let currentDropPiece;
        let mouse;

        img.addEventListener("load", onImage, true);
        // img.src =
        //     "https://cdn.pixabay.com/photo/2022/10/09/02/16/haunted-house-7508035_960_720.jpg";
        img.src = immage.img;

        function initPuzzle() {
            pieces = [];
            mouse = {
                x: 0,
                y: 0,
            };
            currentPiece = null;
            currentDropPiece = null;
            stage.drawImage(
                img,
                0,
                0,
                puzzleWidth,
                puzzleHeight,
                0,
                0,
                puzzleWidth,
                puzzleHeight
            );
            // createTitle("Click to Start Puzzle");

            buildPieces();
        }
        //canvas initial rebder
        function setCanvas() {
            canvas.width = puzzleWidth;
            canvas.height = puzzleHeight;
            canvas.style.border = "1px solid black";
            // stage.drawImage(
            //     img,
            //     0,
            //     0,
            //     puzzleWidth,
            //     puzzleHeight,
            //     0,
            //     0,
            //     puzzleWidth,
            //     puzzleHeight
            // );
        }
        //image load handler based on grid size
        function onImage() {
            pieceWidth = window.matchMedia("(max-width: 768px)").matches
                ? Math.floor(370 / difficulty)
                : Math.floor(img.width / difficulty);
            pieceHeight = Math.floor(img.height / difficulty);
            puzzleWidth = pieceWidth * difficulty;
            puzzleHeight = pieceHeight * difficulty;
            setCanvas();
            initPuzzle();
        }
        //create pieces of tiles
        function buildPieces() {
            let i;
            let piece;
            let xPos = 0;
            let yPos = 0;
            for (i = 0; i < difficulty * difficulty; i++) {
                piece = {};
                piece.sx = xPos;
                piece.sy = yPos;
                pieces.push(piece);
                xPos += pieceWidth;
                if (xPos >= puzzleWidth) {
                    xPos = 0;
                    yPos += pieceHeight;
                }
            }
            document.getElementById("start").onpointerdown = shufflePuzzle;
        }
        //shuffle Grid pieces
        function shufflePuzzle() {
            pieces = shuffleArray(pieces);
            stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
            let xPos = 0;
            let yPos = 0;
            for (const piece of pieces) {
                piece.xPos = xPos;
                piece.yPos = yPos;
                stage.drawImage(
                    img,
                    piece.sx,
                    piece.sy,
                    pieceWidth,
                    pieceHeight,
                    xPos,
                    yPos,
                    pieceWidth,
                    pieceHeight
                );
                stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
                xPos += pieceWidth;
                if (xPos >= puzzleWidth) {
                    xPos = 0;
                    yPos += pieceHeight;
                }
            }
            document.onpointerdown = onPuzzleClick;
        }
        //check the piece is draged or not
        function checkPieceClicked() {
            for (const piece of pieces) {
                if (
                    mouse.x < piece.xPos ||
                    mouse.x > piece.xPos + pieceWidth ||
                    mouse.y < piece.yPos ||
                    mouse.y > piece.yPos + pieceHeight
                ) {
                    //PIECE NOT HIT
                } else {
                    return piece;
                }
            }
            return null;
        }
        //on refresh update puzzle
        function updatePuzzle(e) {
            currentDropPiece = null;
            if (e.layerX || e.layerX == 0) {
                mouse.x = e.layerX - canvas.offsetLeft;
                mouse.y = e.layerY - canvas.offsetTop;
            } else if (e.offsetX || e.offsetX == 0) {
                mouse.x = e.offsetX - canvas.offsetLeft;
                mouse.y = e.offsetY - canvas.offsetTop;
            }
            stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
            for (const piece of pieces) {
                if (piece == currentPiece) {
                    continue;
                }
                stage.drawImage(
                    img,
                    piece.sx,
                    piece.sy,
                    pieceWidth,
                    pieceHeight,
                    piece.xPos,
                    piece.yPos,
                    pieceWidth,
                    pieceHeight
                );
                stage.strokeRect(
                    piece.xPos,
                    piece.yPos,
                    pieceWidth,
                    pieceHeight
                );
                if (currentDropPiece == null) {
                    if (
                        mouse.x < piece.xPos ||
                        mouse.x > piece.xPos + pieceWidth ||
                        mouse.y < piece.yPos ||
                        mouse.y > piece.yPos + pieceHeight
                    ) {
                        //NOT OVER
                    } else {
                        currentDropPiece = piece;
                        stage.save();
                        stage.globalAlpha = 0.4;
                        stage.fillStyle = PUZZLE_HOVER_TINT;
                        stage.fillRect(
                            currentDropPiece.xPos,
                            currentDropPiece.yPos,
                            pieceWidth,
                            pieceHeight
                        );
                        stage.restore();
                    }
                }
            }
            stage.save();
            stage.globalAlpha = 0.6;
            stage.drawImage(
                img,
                currentPiece.sx,
                currentPiece.sy,
                pieceWidth,
                pieceHeight,
                mouse.x - pieceWidth / 2,
                mouse.y - pieceHeight / 2,
                pieceWidth,
                pieceHeight
            );
            stage.restore();
            stage.strokeRect(
                mouse.x - pieceWidth / 2,
                mouse.y - pieceHeight / 2,
                pieceWidth,
                pieceHeight
            );
        }
        //Drag puzzle
        function onPuzzleClick(e) {
            if (e.layerX || e.layerX === 0) {
                mouse.x = e.layerX - canvas.offsetLeft;
                mouse.y = e.layerY - canvas.offsetTop;
            } else if (e.offsetX || e.offsetX === 0) {
                mouse.x = e.offsetX - canvas.offsetLeft;
                mouse.y = e.offsetY - canvas.offsetTop;
            }
            currentPiece = checkPieceClicked();
            if (currentPiece !== null) {
                stage.clearRect(
                    currentPiece.xPos,
                    currentPiece.yPos,
                    pieceWidth,
                    pieceHeight
                );
                stage.save();
                stage.globalAlpha = 0.9;
                stage.drawImage(
                    img,
                    currentPiece.sx,
                    currentPiece.sy,
                    pieceWidth,
                    pieceHeight,
                    mouse.x - pieceWidth / 2,
                    mouse.y - pieceHeight / 2,
                    pieceWidth,
                    pieceHeight
                );
                stage.restore();
                document.onpointermove = updatePuzzle;
                document.onpointerup = pieceDropped;
            }
        }
        //game over
        function gameOver() {
            document.onpointerdown = null;
            document.onpointermove = null;
            document.onpointerup = null;

            initPuzzle();
        }
        //drop puzzle
        function pieceDropped(e) {
            document.onpointermove = null;
            document.onpointerup = null;

            if (currentDropPiece !== null) {
                let tmp = {
                    xPos: currentPiece.xPos,
                    yPos: currentPiece.yPos,
                };
                currentPiece.xPos = currentDropPiece.xPos;
                currentPiece.yPos = currentDropPiece.yPos;
                currentDropPiece.xPos = tmp.xPos;
                currentDropPiece.yPos = tmp.yPos;
            }
            resetPuzzleAndCheckWin();
        }
        //Reset when done
        function resetPuzzleAndCheckWin() {
            stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
            let gameWin = true;
            for (piece of pieces) {
                stage.drawImage(
                    img,
                    piece.sx,
                    piece.sy,
                    pieceWidth,
                    pieceHeight,
                    piece.xPos,
                    piece.yPos,
                    pieceWidth,
                    pieceHeight
                );
                stage.strokeRect(
                    piece.xPos,
                    piece.yPos,
                    pieceWidth,
                    pieceHeight
                );
                if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
                    gameWin = false;
                }
            }
            if (gameWin) {
                setToaster(true);
                // console.log("Welcome to the AK's Team --->");
                // createTitle("Welcome to the AK's Team");
                setModalState(true);
                setIsActive(false);
                setTimeout(gameOver, 200);
                setSeconds((pre) =>
                    localStorage.setItem("seconds", JSON.stringify(pre))
                );
            }
        }

        function shuffleArray(o) {
            for (
                var j, x, i = o.length;
                i;
                j = parseInt(Math.random() * i),
                    x = o[--i],
                    o[i] = o[j],
                    o[j] = x
            );
            return o;
        }
        //Grid size
        function updateDifficulty(e) {
            difficulty = e.target.value;
            pieceWidth = Math.floor(img.width / difficulty);
            pieceHeight = Math.floor(img.height / difficulty);
            puzzleWidth = pieceWidth * difficulty;
            puzzleHeight = pieceHeight * difficulty;
            gameOver();
        }
        document.querySelector("#GridSize").oninput = updateDifficulty;
    };
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    function toggle() {
        setIsActive(!isActive);
        const time = document.getElementById("timer");
        time.style.display = "block";

        const startTime = document.getElementById("start");
        startTime.style.opacity = 0;
    }

    function reset() {
        setSeconds(0);
        setIsActive(false);
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevTime) => prevTime + 10);
            }, 10);
        } else if (!isActive) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    return (
        <>
            <div className="flex justify-center items-center w-full h-screen  ">
                {modalState && (
                    <Modal
                        seconds={seconds}
                        modalState={modalStateHandler}
                        state={modalState}
                    />
                )}
                {toaster && (
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                )}
                <div>
                    <div className="flex justify-center my-6">
                        <label className="font-extrabold text-4xl  shadow-xl mr-2 py-4 text-zinc-900 bg-white rounded-md">
                            Task 2: PUZZLE APP
                        </label>
                    </div>

                    <br />
                    <div className="z-0 flex  w-full max-w-[200px] mx-auto justify-center items-center ">
                        <div>
                            <label className="font-bold text-xl mx-8 text-zinc-900">
                                ENTER PUZZLE SIZE OF GRID :
                            </label>
                            <input
                                className=" mx-4  border border-zinc-500 outline-none h-12 w-80 p-4 shadow-xl rounded-lg"
                                type="number"
                                value={value}
                                min={2}
                                required
                                onChange={(e) => {
                                    images();
                                    if (e.target.value > 5) {
                                        return;
                                    } else {
                                        {
                                            setValue(e.target.value);
                                            setLoader(true);
                                        }
                                    }
                                }}
                                id="GridSize"
                            />

                            {value ? (
                                <div className="mx-4">
                                    <div className="relative my-2 ">
                                        <button
                                            id="start"
                                            className="bg-zinc-900 box-border shadow-xl opacity-100 rounded-lg hover:text-zinc-900 text-white hover:bg-text-zinc-900 font-semibold hover:bg-zinc-300  px-10 py-3 p-1"
                                            onClick={toggle}
                                        >
                                            START
                                        </button>
                                        <button
                                            onClick={() =>
                                                window.location.reload(
                                                    "/PuzzleImage"
                                                )
                                            }
                                            className="bg-zinc-900 box-border shadow-xl opacity-100 rounded-lg hover:text-zinc-900 text-white hover:bg-text-zinc-900 font-semibold hover:bg-zinc-300 ml-1.5 px-8 py-3 p-1"
                                        >
                                            Change Puzzle
                                        </button>
                                        <div
                                            id="timer"
                                            className={`absolute top-0 hidden left-0 py-3   bg-slate-400 border-slate-800 w-[100px] text-xl font-bold rounded-lg`}
                                        >
                                            <span className="text-center">
                                                {(
                                                    "0" +
                                                    Math.floor(
                                                        (seconds / 60000) % 60
                                                    )
                                                ).slice(-2)}
                                                :
                                            </span>
                                            <span className="text-center">
                                                {(
                                                    "0" +
                                                    Math.floor(
                                                        (seconds / 1000) % 60
                                                    )
                                                ).slice(-2)}
                                                :
                                            </span>
                                            <span className="text-center">
                                                {(
                                                    "0" +
                                                    ((seconds / 10) % 100)
                                                ).slice(-2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {/* <button onClick={notify}>Notify!</button> */}

                            <canvas id="canvas" />

                            <img
                                className="flex justify-center  items-center w-54  object-cover h-24 rounded-md"
                                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/Screenshot_2022-11-03_011620-removebg-preview.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
