import {cpSync,readdirSync,writeFileSync} from "node:fs";
// После сборки обновляем готовую статическую копию в корне репозитория.
for(const name of readdirSync(new URL("../dist/",import.meta.url)))cpSync(new URL("../dist/"+name,import.meta.url),new URL("../"+name,import.meta.url),{recursive:true});
writeFileSync(new URL("../.nojekyll",import.meta.url),"");
