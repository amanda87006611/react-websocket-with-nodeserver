import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./component/Cursor";
import { CgHello } from "react-icons/cg";
import TextEditor from "./component/TextEditor";
import "./component/style.css";

const Home = ({ username }) => {
  const WS_URL = "ws://127.0.0.1:8000";
  const currentUserUuid = useRef();

  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
    onOpen: (evt) => {
      setSocket(evt.currentTarget);
      currentUserUuid.current = evt.currentTarget.url.split("=")[1];
    },
  });

  const THROTTLE = 50;
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));
  //使用Ref包住function -> 本身為一個obj / ref屬性改變不會導致畫面的render(僅初次才致畫面render)

  const renderCursor = (users, currentUserUuid) => {
    return Object.keys(users).map((uuid) => {
      if (users[uuid].username !== currentUserUuid) {
        const user = users[uuid];
        return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
      }
      return null;
    });
  };

  useEffect(() => {
    // initial val
    sendJsonMessage({
      type: "cursor",
      x: 0,
      y: 0,
    });
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottled.current({
        type: "cursor",
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta, olddelta, source) => {
      if (source !== "user") return;
      const message = { type: "edit", delta };
      sendJsonMessage(message);
    };

    quill.on("text-change", handler);

    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  const handleReceivedMessage = (messageEvent) => {
    Object.keys(messageEvent).forEach((uuid) => {
      const user = messageEvent[uuid];
      if (
        user.state.type === "edit" &&
        user.username !== currentUserUuid.current
      ) {
        quill.updateContents(user.state.delta);
      }
    });
  };

  useEffect(() => {
    if (socket === null || quill === null) return;
    handleReceivedMessage(lastJsonMessage);
  }, [lastJsonMessage]);

  return (
    <>
      <div className='topBox'>
        <CgHello />
        <h4 className='title'>
          Hello , {username} Welcome back to your editor.
        </h4>
      </div>
      <TextEditor setQuill={setQuill} />
      {lastJsonMessage && (
        <>{renderCursor(lastJsonMessage, currentUserUuid.current)}</>
      )}
    </>
  );
};
export default Home;
