import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    if (!username || !password) {
      toast.error("Please fill in both username and password fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://stg.dhunjam.in/account/admin/login",
        { username, password },
        config
      );
      localStorage.setItem("adminInfo", JSON.stringify(data.data));
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="container sm:max-w-md max-w-xs h-[100vh] gap-10 flex flex-col justify-center">
      <label className="text-heading">Venue Admin Login</label>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-transparent border border-[#FFFFFF] rounded-md p-2"
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border border-[#FFFFFF] rounded-md p-2"
          placeholder="Password"
        />
      </div>
      <button onClick={handleLogin} className="bg-[#6741D9] rounded-md py-2">
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  );
};

export default Login;
