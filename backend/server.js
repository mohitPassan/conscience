import express from 'express';
import cors from 'cors';

import pollution from './routes/pollution.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/pollution', pollution)

app.listen(8000, () => {
    console.log('Server listening on port 8000');
});