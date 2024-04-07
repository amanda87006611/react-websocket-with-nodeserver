import { useState, useCallback, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered", list: "bullet" }],
  [{ color: [] }],
  [{ background: [] }],
  [{ script: "sub" }],
  [{ script: "super" }],
  [{ align: [] }],
  ["image", "blockqoute", "code-block"],
  ["clean"],
];

const TextEditor = ({ setQuill }) => {
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  return <div className='container' ref={wrapperRef}></div>;
};

export default TextEditor;
