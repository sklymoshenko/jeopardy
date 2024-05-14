import { Router, Route } from "@solidjs/router"

const Home = lazy(() => import("./routes/Home"))
const CreateEvent = lazy(() => import("./routes/CreateEvent"))
const OverviewEvent = lazy(() => import("./routes/OverviewEvent"))
const CreateRound = lazy(() => import("./routes/CreateRound"))
const PlayRound = lazy(() => import("./routes/PlayRound"))

import { Component, lazy } from "solid-js"
import { GameStateContextProvider } from "./context/store"

const App: Component = () => {
  return (
    <div class="dark:text-white bg-white dark:bg-gray-800 h-dvh w-screen px-4 overflow-x-hidden overflow-y-auto">
      <GameStateContextProvider>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/create_event" component={CreateEvent} />
          <Route path="/overview_event" component={OverviewEvent} />
          <Route path="/create_round" component={CreateRound} />
          <Route path="/edit_round/:id" component={CreateRound} />
          <Route path="/play_round/:id" component={PlayRound} />
        </Router>
      </GameStateContextProvider>
    </div>
  )
}

export default App
