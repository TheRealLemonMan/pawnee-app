import React from "react";
import ReactDOM from "react-dom/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import App from "./App";
import "./estilos/global.css";

gsap.registerPlugin(useGSAP);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
