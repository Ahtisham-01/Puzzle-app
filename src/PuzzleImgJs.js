import React, { useState, useRef } from "react";
import sq1 from "./puzzleImg/4pc/min-sq-1.jpg";
import sq2 from "./puzzleImg/4pc/min-sq-2.jpg";
import sq3 from "./puzzleImg/4pc/min-sq-3.jpg";
import sq4 from "./puzzleImg/4pc/min-sq-4.jpg";

export default function PuzzleNumbers() {
    // Variable Definitions
    let gridValues = [];
    const max = 5;

    const img = new Image();
    const imgArray = [
        {
            id: 1,
            img: sq1,
        },
        {
            id: 2,
            img: sq2,
        },
        {
            id: 3,
            img: sq3,
        },
        {
            id: 4,
            img: sq4,
        },
    ];

    const shuffledImgArray = [...imgArray];
    let i = shuffledImgArray.length;
    while (i--) {
        const ri = Math.floor(Math.random() * i);
        [shuffledImgArray[i], shuffledImgArray[ri]] = [
            shuffledImgArray[ri],
            shuffledImgArray[i],
        ];
    }
    console.log(shuffledImgArray);

    //useRefs
    const dragItem = useRef();
    const dragOverItem = useRef();
    const firstValue = useRef();
    const secondValue = useRef();

    // UseStates
    const [userValue, setUserValue] = useState("");
    const [gridArray, setGridArray] = useState(gridValues);
    // const [imgArray, setImageArray] = useState(imageArr)
    const [cardBG, setCardBG] = useState("inherit");

    // Draggable Items on desktop
    const dragStart = (e, idx) => {
        dragItem.current = idx;
    };

    const dragEnter = (e, idx) => {
        dragOverItem.current = idx;
    };

    const drop = (e) => {
        const copyListItems = [...gridArray];
        const dragItemContent = copyListItems[dragItem.current];

        // Switch elements of selected tiles
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setGridArray(copyListItems);

        // Comparison with sorted array
        // let sorted = sortGridArr(gridArray)
        if (JSON.stringify(copyListItems) === JSON.stringify(imgArray)) {
            alert("Welcome to the team!");
        }
    };

    // Swapping Items on Touch
    function handleStart(e, idx) {
        if (firstValue.current) {
            // Store tile value of second selected tile
            secondValue.current = idx;
            const copyListItemsResp = [...gridArray];

            // Switch elements of selected tiles
            const dragItemContentRespOne =
                copyListItemsResp[firstValue.current];
            const dragItemContentRespTwo =
                copyListItemsResp[secondValue.current];
            copyListItemsResp.splice(firstValue.current, 1);
            copyListItemsResp.splice(
                firstValue.current,
                0,
                dragItemContentRespTwo
            );
            copyListItemsResp.splice(secondValue.current, 1);
            copyListItemsResp.splice(
                secondValue.current,
                0,
                dragItemContentRespOne
            );
            firstValue.current = null;
            secondValue.current = null;
            setCardBG("inherit");
            setGridArray(copyListItemsResp);

            // Comparison with sorted array
            let sorted = sortGridArr(gridArray);
            if (JSON.stringify(copyListItemsResp) === JSON.stringify(sorted)) {
                alert("Welcome to the team!");
            }
        } else {
            // Store tile value of first selected tile
            firstValue.current = idx;

            // Set grid background to gray
            setCardBG("zinc-200");
        }
    }

    function sortGridArr(arr) {
        arr.sort(function (a, b) {
            return a - b;
        });
        return arr;
    }

    // Get value from input field
    const getInputValue = (event) => {
        // let dup = Math.max(min, Math.min(max, Number(event.target.value)))
        let dup = Math.min(max, Number(event.target.value));
        // let dup = event.target.value
        setUserValue(dup);
        // set grid columns and create unique array
        if (dup) {
            // setUserValue passes to useState
            setUserValue(dup);

            // create unique array of n x n elements
            // setGridArray(createGridValues(dup * dup))
            setGridArray(shuffledImgArray);

            // Sets number of columns and rows for grid
            document.documentElement.style.setProperty("--col-num", dup);
            document.documentElement.style.setProperty("--row-num", dup);
        } else {
            setUserValue("");
            setGridArray([]);
        }
    };

    // function createGridValues(cols) {
    //     for (let i = 0; i < cols; i++) {
    //         let num = Math.floor((Math.random() * cols)) + 1
    //         if (gridValues.includes(num)) {
    //             i = i - 1

    //         }
    //         else {
    //             gridValues.push();
    //         }
    //     }
    //     return gridValues
    // }

    return (
        <div className="  flex">
            <div className="mx-auto my-auto p-6 bg-white md:w-[70%] w-full rounded-md">
                <div className="flex flex-col gap-2 mx-auto w-full h-1/4 max-w-[500px] text-center justify-center items-center m-4">
                    <h1>Evaluation Test</h1>
                    <input
                        value={userValue}
                        onChange={getInputValue}
                        type="number"
                        placeholder="Enter a number up to 5 only!"
                        className="px-4 py-4 text-4 h-4 border border-black-200 rounded-full w-full max-w-[90%]"
                    />
                </div>
                <div
                    style={{ gridTemplateColumns: `repeat(${userValue}, 1fr` }}
                    className={`md:max-w-[70%] mx-auto grid grid-cols-${userValue} grid-rows-${userValue} rounded-md border border-1-gray-900 m-4`}
                >
                    {gridArray?.map((item, idx) => {
                        return (
                            <div
                                key={idx * 1000 * Math.random()}
                                className={`p-[5px] text-[#18181B] text-center border-b border-r bg-${cardBG}`}
                                // Touch functions
                                onTouchStart={(e) => handleStart(e, idx)}
                                // Drag functions
                                onDragStart={(e) => dragStart(e, idx)}
                                onDragEnter={(e) => dragEnter(e, idx)}
                                onDragEnd={drop}
                                draggable
                            >
                                {/* {item} */}
                                <img src={item?.img} />
                            </div>
                        );
                    })}
                </div>
                <div className="visible md:invisible bg-orange-200 rounded-md p-2 text-sm">
                    <h2 className="text-red-600 mb-1">
                        <span className="font-bold mr-2">!</span>Important
                    </h2>
                    <p>
                        To move tiles on mobile, please tap on two tiles to
                        swap. Once selected, the grid turns gray. Select second
                        tile to swap with previously selected tile.
                    </p>
                </div>
            </div>
        </div>
    );
}
