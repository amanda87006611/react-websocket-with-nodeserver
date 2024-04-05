import { useState } from "react";

const Login = ({ onSubmit }) => {
  const [userName, setUserName] = useState("");
  return (
    <>
      <h1>Welcome</h1>
      <p>What Should people call you?</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(userName);
        }}>
        <input
          type='text'
          value={userName}
          placeholder='user name'
          onChange={(e) => setUserName(e.target.value)}
        />
        <input type='submit' />
      </form>
    </>
  );
};

export default Login;
