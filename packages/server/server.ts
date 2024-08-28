import express from 'express';
import routes from './src/routes/index.js';
import middlewares from './src/middlewares/index.js';
import infra from './src/infra/index.js';

const PORT = process.env.PORT || 3000;

const app = express();
infra.setup(app);
middlewares.setup(app);

app.get('/', (req, res) => res.send('hello'));
app.use('/records', routes.Records);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
