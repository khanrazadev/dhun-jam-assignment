import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";

function App() {
  return (
    <Routes>
      <Route path="/" exact Component={Login} />
    </Routes>
  );
}

export default App;
