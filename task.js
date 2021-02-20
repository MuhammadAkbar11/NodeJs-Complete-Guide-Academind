const http = require('http');

const server = http.createServer((req, res) => {
	const url = req.url;
	const method = req.method;
	if (url === '/') {
		res.setHeader('Content-Type', 'text/html');
		res.write('<html>');
		res.write('<head><title>Root Routes</title><head>');
		res.write(`
			<body>
            <h1>Welcome To My Website</h1>
                <h2>Input your name here!!</h2>
                <form action="/create-user" method="post">
                    <input type="text" name="username" >
                    <button type="submit">Send</button>
                </form>
            </body>`);
		res.write('</html>');
		return res.end();
	}

	if (url === '/users') {
		res.setHeader('Content-Type', 'text/html');
		res.write('<html>');
		res.write('<head><title>User Page</title><head>');
		res.write(`
			<body>
                <ul>
                    <li>User1</li>
                    <li>User2</li>
                </ul>
            </body>`);
		res.write('</html>');
		return res.end();
	}

	if (url === '/create-user') {
		const body = [];
		req.on('data', chunk => {
			body.push(chunk);
		});
		req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const userneme = parsedBody.split('=')[1];
			// username
			console.log(userneme);
		});
		res.statusCode = 302;
		res.setHeader('Location', '/');
		return res.end();
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>Taks 1</title><head>');
	res.write('<body><h1>Hello Welcome To my Website</h1></body>');
	res.write('</html>');
	res.end();
});

server.listen(3000);
