import cron from 'node-cron';
import { CronResolver } from '../../src/lib/prisma/resolvers/cron.resolver';
import { CronExpression } from '../cron-exression';

cron.schedule(
  CronExpression.EVERY_MINUTE,
  () => {
    console.log('Running grade update...');
    CronResolver.updateCourseAndGroupGrades();
  },
  {
    scheduled: true,
    timezone: 'Asia/Yerevan',
  },
);
