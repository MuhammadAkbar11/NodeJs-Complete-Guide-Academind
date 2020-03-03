const http = require('http');

const server = http.createServer((req, res) => {
	console.log(req.url, req.method, req.headers);
	const url = req.url;
	if (url === '/') {
		res.setHeader('Content-Type', 'text/html');
		res.write('<html>');
		res.write('<head><title>Enter Message</title><head>');
		res.write(`
			<body>
			<h1>Rounting Request</h1>
                <form action="/message" method="post">
                    <input type="text" name="message" id="">
                    <button type="submit">Send</button>
                </form>
            </body>`);
		res.write('</html>');
		return res.end();
	}
	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My first Page</title><head>');
	res.write('<body><h1>Hello from my node.js  Server</h1></body>');
	res.write('</html>');
	res.end();
});

server.listen(3000);
