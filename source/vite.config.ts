import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {fileURLToPath,URL} from "node:url";
// Относительные пути позволяют сайту работать в /Juican-/ на GitHub Pages.
export default defineConfig({base:"./",plugins:[react()],publicDir:"../media",resolve:{alias:{"@":fileURLToPath(new URL(".",import.meta.url))}},build:{outDir:"../dist",emptyOutDir:true}});
