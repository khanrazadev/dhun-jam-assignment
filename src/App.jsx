import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" exact Component={Login} />
      <Route path="/dashboard" exact Component={AdminDashboard} />
    </Routes>
  );
}

export default App;
