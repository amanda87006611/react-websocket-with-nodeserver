import { useState } from "react";
import Login from "./component/Login";
import Home from "./Home";

function App() {
  const [userName, setUserName] = useState("");
  return userName ? (
    <Home username={userName} />
  ) : (
    <Login onSubmit={setUserName} />
  );
}

export default App;
