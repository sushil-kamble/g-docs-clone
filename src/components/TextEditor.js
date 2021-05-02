import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"]
];

export default function TextEditor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id: documentId } = useParams();
  const [change, setChange] = useState(false);

  useEffect(() => {
    // INCOMING MONGODB DOCUMENT
    if (socket == null || quill == null) return;
    socket.once("load-document", document => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // AUTOSAVE OFF
  // const SAVE_INTERVAL = 20000;
  // useEffect(() => {
  //   if (socket == null || quill == null) return;
  //   const interval = setInterval(() => {
  //     socket.emit("save-document", quill.getContents());
  //   }, SAVE_INTERVAL);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [socket, quill]);

  useEffect(() => {
    // TEXT-CHANGE - ME
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
      setChange(true);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    // TEXT-CHANGE - OTHERS
    if (socket == null || quill == null) return;
    const handler = delta => {
      quill.updateContents(delta);
      setChange(true);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    const link =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://g-doc.herokuapp.com/";
    const s = io(link);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const wrapperRef = useCallback(wrapper => {
    if (wrapper === null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS
      }
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  useEffect(() => {
    // SAVING TO MONGODB
    if (socket == null || quill == null) return;
    const keyDown = document.addEventListener("keydown", e => {
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
        e.preventDefault();
        setChange(false);
        socket.emit("save-document", quill.getContents());
      }
    });
    return () => {
      document.removeEventListener("keydown", keyDown);
    };
  }, [socket, quill]);

  return (
    <div
      className="container"
      ref={wrapperRef}
      style={{
        "--base": `${change ? "red" : "green"}`
      }}
    ></div>
  );
}
