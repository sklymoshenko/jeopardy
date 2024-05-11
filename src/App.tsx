import { Router, Route } from "@solidjs/router";

const Home = lazy(() => import("./routes/Home"));
const CreateEvent = lazy(() => import("./routes/CreateEvent"));
import { Component, lazy } from "solid-js";

const App: Component = () => {
  return (
    <div class="dark:text-white bg-white dark:bg-gray-800 h-dvh w-screen px-4">
      <Router>
        <Route path="/" component={Home} />
        <Route path="/create_event" component={CreateEvent} />
      </Router>
    </div>
  );
};

export default App;
