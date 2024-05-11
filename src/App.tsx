import type { Component } from "solid-js";
import "flowbite";

const App: Component = () => {
  return (
    <div class="dark:text-white bg-white dark:bg-gray-800 h-dvh w-screen">
      <h1 class="font-semibold xss:text-[3rem] md:text-[4rem] text-center pt-28">The Game</h1>
      <div class="mt-10 xss:px-4 md:xss:px-0 md:w-[50%] mx-auto">
        <input
          type="text"
          id="large-input"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div class="mt-6 flex items-center justify-end">
          <button
            type="button"
            class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2 xss:w-1/3 md:w-36 transition-colors"
          >
            Create
          </button>
          <button
            type="button"
            class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-3 text-center mb-2 xss:w-1/3 md:w-36"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
