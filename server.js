import express from 'express';
import path from 'path';

const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));
// need to declare a "catch all" route on your express server
// that captures all page requests and directs them to the client
// the react-router do the route part
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(process.env.PORT || 3001);
