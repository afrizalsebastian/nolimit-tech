import { PrismaClient } from '@prisma/client';
import { Logger } from './logger.service';

const PrismaService = new PrismaClient({
  log: [
    { level: 'info', emit: 'event' },
    { level: 'query', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

PrismaService.$on('query', (e) => {
  Logger.info(e.query);
});

PrismaService.$on('info', (e) => {
  Logger.info(e);
});

PrismaService.$on('warn', (e) => {
  Logger.warn(e);
});

PrismaService.$on('error', (e) => {
  Logger.error(e);
});

export default PrismaService;
