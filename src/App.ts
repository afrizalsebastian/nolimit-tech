import ErrorHandlerMiddleware, {
  NotFoundError,
} from '@middlewares/errorHandler.middleware';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { RoutesV1 } from './routes';

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

RoutesV1.forEach((it) => {
  app.use(`/api/v1/${it.name}`, it.router);
});

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(ErrorHandlerMiddleware);

export default app;
