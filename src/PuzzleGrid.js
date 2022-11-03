import React, { useState, useEffect } from "react";

const Grid = ({ puzzleSize, gameCompleted }) => {
	const [puzzleGrid, setPuzzleGrid] = useState([]);
	const [starterBox, setStarterBox] = useState({});
	const [completed, setCompleted] = useState(false);

	let puzzleBoxes_arr = [];

	// Store Boxes in localStorage
	const storeBoxes = (localBoxes) => {
		localStorage.setItem("puzzleGrid", JSON.stringify(localBoxes));
	};

	// Get Boxes from localStorage
	const getBoxes = () => {
		return JSON.parse(localStorage.getItem("boxes"))
	};

	// Funtion to Shuffle The items using math.random
	const shuffle = (array) => {
		let new_arr = [];
		while (new_arr.length < array.length) {
			let random_item = array[Math.floor(Math.random() * array.length)];
			if (!new_arr.includes(random_item)) {
				new_arr.push(random_item);
			}
		}
		storeBoxes(new_arr);
		return new_arr;
	};
	// calls Shuffle the initial value of the boxes which are linear
	useEffect(() => {
		const localBoxes = getBoxes();
		if (localBoxes && localBoxes.length > 0) {
			setPuzzleGrid(localBoxes);
		} else {
			setPuzzleGrid([...shuffle(puzzleBoxes_arr)]);
		}
	}, [puzzleSize]);

	if (!puzzleSize) {
		return null;
	}
	for (let i = 1; i <= puzzleSize * puzzleSize; i++) {
		puzzleBoxes_arr.push({ id: i });
	}
	// return null If the size of the grid is not provided yet
	const gridCreate = () => {
		if (!puzzleGrid.length) {
			return null;
		}

		// Checks if the puzzle is completed
		const checkCompleted = () => {
			const compLoop = puzzleGrid.every((e, index) => {
				return e.id === index + 1;
			});

			if (compLoop) {
				storeBoxes([]);
				setCompleted(compLoop);
				gameCompleted(completed);
			}
		};

		// Swap the items in the State
		const swapBoxes = (fromBox, toBox) => {
			let boxes_new = puzzleGrid;
			const fromBoxIndex = puzzleGrid.findIndex((e) => {
				return e.id === fromBox.id;
			});
			const toBoxIndex = puzzleGrid.findIndex((e) => {
				return e.id === toBox.id;
			});

			let swapArrayElements = function (array, indexA, indexB) {
				let temp = array[indexA];
				array[indexA] = array[indexB];
				array[indexB] = temp;
			};
			swapArrayElements(boxes_new, fromBoxIndex, toBoxIndex);
			setPuzzleGrid([...boxes_new]);
			// Check boxes
			storeBoxes(boxes_new);
			checkCompleted();
		};
	

		return puzzleGrid.map((e) => {
			return (
				<div
					draggable
					onDrop={() => {
						swapBoxes(starterBox, e);
					}}
					onDragStart={() => {
						setStarterBox({ ...e });
					}}
					onDragEnd={(event) => {
						event.target.classList.remove("starter");
						document.querySelectorAll(`.gridSelected > div`).forEach((e) => {
							document.body.classList.remove("opacity-50");
							e.classList.remove("bg-zinc-300");
							e.classList.remove("border-green-400");
							e.classList.add("bg-zinc-900");
						});
					}}
					onDragOver={(event) => {
						event.preventDefault();
						event.target.classList.add("starter");
						document.querySelectorAll(`.dropzonesAll`).forEach((e) => {
							e.classList.add("bg-zinc-300");
							e.classList.add("border-green-400");
							e.classList.remove("bg-zinc-900");
						});
						document.body.classList.add("opacity-50");
					}}
					className={`dropzonesAll rounded-lg bg-zinc-900  hover:bg-zinc-300 hover:text-zinc-900 border-4 hover:border-zinc-400 cursor-move shadow-2xl z-10 relative h-32 w-32   flex flex-col justify-evenly text-center mt-50px text-white align-middle`}
					key={e.id}
				>
					<p className="align-middle -z-1 relative inline font-semibold text-4xl oldstyle-nums ">
						{e.id}
					</p>
				</div>
			);
		});
	};
	return (
		<div
			style={{ gridTemplateColumns: `repeat(${puzzleSize}, 1fr)` }}
			className={`gridSelected grid rounded-xl  grid-cols-${puzzleSize} grid-rows-${puzzleSize} shadow-4xl  w-full  justify-items-center gap-4   mx-auto p-6`}
		>
			{gridCreate()}
		</div>
	);
};

export default Grid;
