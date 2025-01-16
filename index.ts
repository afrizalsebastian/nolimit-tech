import { Logger } from '@common/logger.service';
import dotenv from 'dotenv';
import app from './src/App';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`Server running in port ${PORT}`);
});
