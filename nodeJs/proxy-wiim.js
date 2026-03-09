//https://nodejs.org
//node proxy-wiim.js
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:resume
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:pause
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:onepause
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:prev
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:next
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:stop
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:mute:1
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:mute:0
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:10
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:20
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:30
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:40
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:50
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:60
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:70
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:80
//http://192.168.0.229:8080/httpapi.asp?command=setPlayerCmd:vol:90


const http = require('http');
const https = require('https');

const proxyPort = 8080; // Porta su cui ascolta il proxy
const wiimHost = '192.168.0.xxx'; // IP del tuo Wiim Pro 
const wiimPort = 443;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const options = {
    hostname: wiimHost,
    port: wiimPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
    rejectUnauthorized: false // 🔓 Ignora il certificato autofirmato
  };

  const proxy = https.request(options, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (e) => {
    res.writeHead(500);
    res.end('Errore proxy: ' + e.message);
  });
});

server.listen(proxyPort, () => {
  console.log(`Proxy attivo su http://localhost:${proxyPort}`);
});
