import { build } from 'esbuild';
import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
const root='node_modules/@ladybugdb/wasm-core';
await mkdir('dist/vendor',{recursive:true});
for(const name of ['index.html','style.css','app.js','wasm.html','wasm-lab.js','responsive.css','ui-enhancements.js'])await cp(name,join('dist',name));
await build({entryPoints:[join(root,'index.js')],outfile:'dist/vendor/lbug.js',bundle:true,platform:'browser',format:'esm',target:'es2022',loader:{'.wasm':'file'},assetNames:'[name]'});
await build({entryPoints:[join(root,'lbug_wasm_worker.js')],outfile:'dist/vendor/lbug_wasm_worker.js',bundle:true,platform:'browser',format:'iife',target:'es2022',loader:{'.wasm':'file'},assetNames:'[name]'});
async function copyWasm(dir){for(const item of await readdir(dir)){const path=join(dir,item);if((await stat(path)).isDirectory()){if(!['nodejs','multithreaded'].includes(item))await copyWasm(path)}else if(item.endsWith('.wasm'))await cp(path,join('dist/vendor',item));}}
await copyWasm(root);
console.log('Built browser assets in dist/');
