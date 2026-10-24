import React from "react";
import {createRoot} from "react-dom/client";
import "./app/fonts.css";
import App from "./app/page";
import "./app/globals.css";
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
