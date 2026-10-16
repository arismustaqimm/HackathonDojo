// Zero-dependency local development server. Production: deploy the static files to Vercel/Netlify.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir=fileURLToPath(new URL('.',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
const port=Number(process.env.PORT||5173);
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const reqPath=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const path=normalize(join(dir,reqPath));
  if(!path.startsWith(dir)||/\/(database|node_modules|\.git)(\/|$)/.test(path)){
   res.writeHead(403).end('Forbidden');return;
  }
  const file=await stat(path);
  if(!file.isFile())throw new Error('Not a file');
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  res.end(await readFile(path));
 }catch{res.writeHead(404).end('Not found')}
}).listen(port,()=>console.log(`Scholarku ready at http://localhost:${port}`));
