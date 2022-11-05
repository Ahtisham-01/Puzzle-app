import React from "react";
const Modal = ({ modalState, state }) => {
    const seconds = localStorage.getItem("seconds");
    return (
        <div
            className={`modal ${
                state ? "flex" : "hidden"
            } bg-zinc-400 pt-10 pb-3 z-50 flex-col  justify-center items-center opacity-90  absolute top-0 bottom-0 right-0 h-screen left-0 border border-zinc-600`}
        >
            <p className="text-xl text-zinc-900 font-bold pb-10 z-50">
                You solve this puzzle in :
                <span className="text-center">
                    {("0" + Math.floor((seconds / 60000) % 60)).slice(-2)}h:
                </span>
                <span className="text-center">
                    {("0" + Math.floor((seconds / 1000) % 60)).slice(-2)}m:
                </span>
                <span className="text-center">
                    {("0" + ((seconds / 10) % 100)).slice(-2)}s
                </span>
            </p>
            <button
                onClick={() => {
                    // modalState
                    window.location.replace("/");
                }}
                className="px-10 rounded-md h-11 bg-zinc-900 hover:text-zinc-900 text-white hover:bg-zinc-300 font-bold text-lg"
            >
                Close
            </button>
        </div>
    );
};

export default Modal;
