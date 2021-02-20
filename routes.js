const fs = require('fs');

const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.setHeader('Content-Type', 'text/html');
		res.write('<html>');
		res.write('<head><title>Enter Message</title><head>');
		res.write(`
            <body>
            <h1>Input your message</h1>
                <form action="/message" method="post">
                    <input type="text" name="message" id="">
                    <button type="submit">Send</button>
                </form>
            </body>`);
		res.write('</html>');
		return res.end();
	}

	if (url == '/message' && method == 'POST') {
		const body = [];
		req.on('data', chunk => {
			console.log(chunk);
			body.push(chunk);
		});
		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];
			fs.writeFile('message.txt', message, err => {
				res.statusCode = 302;
				res.setHeader('Location', '/');
				return res.end();
			});
		});
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My first Page</title><head>');
	res.write('<body><h1>Hello from my node.js  Server</h1></body>');
	res.write('</html>');
	res.end();
};

// module.exports = requestHandler;

module.exports = {
	handler: requestHandler,
	someText: 'Hello!!'
};

//=> module.exports.handler = requestHandler;
//=> module.exports.someText = 'Hello!!'

//=> exports.handler = requestHandler;
//=> exports.someText = 'Hello!!'