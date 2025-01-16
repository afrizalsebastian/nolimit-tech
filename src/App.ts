import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    data: {
      messsage: 'API status ok',
    },
  });
});

export default app;
