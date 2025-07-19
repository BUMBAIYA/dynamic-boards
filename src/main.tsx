import { createRoot } from "react-dom/client";

import { MainEntry } from "@/main-entry";
import "@/styles/main.css";

createRoot(document.getElementById("root")!).render(<MainEntry />);
