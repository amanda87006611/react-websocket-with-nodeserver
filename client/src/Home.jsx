import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./component/Cursor";

const Home = ({ username }) => {
  const WS_URL = "ws://127.0.0.1:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const THROTTLE = 50;
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));
  //使用Ref包住function -> 本身為一個obj / ref屬性改變不會導致畫面的render(僅初次才致畫面render)

  const renderCursor = (users) => {
    return Object.keys(users).map((uuid) => {
      const user = users[uuid];
      return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
    });
  };

  useEffect(() => {
    // initial val
    sendJsonMessage({
      x: 0,
      y: 0,
    });
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);

  return (
    <>
      <h1>Hello , {username}</h1>
      {lastJsonMessage && <>{renderCursor(lastJsonMessage)}</>}
    </>
  );
};
export default Home;
