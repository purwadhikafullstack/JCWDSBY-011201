import cron from 'node-cron';
import transactions from '../../models/transactions.model';
import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import { DB } from '../../db';

export const updateArrivedToFinishedScheduleJobs =  () => {
  const scheduledJobsFunc = cron.schedule('*/30 * * * *', async () => {
    console.log('Operation update Arrived to Finished begin');
    await DB.initialize();
    try {
      await DB.db.sequelize.transaction(async (t) => {
        await transactions.update(
          { paymentStatus: 'finished' },
          {
            where: {
              paymentStatus: 'arrived',
              updatedAt: { [Op.lte]: subDays(new Date(), 3) },
            },
            transaction: t,
          },
        );
      });
      console.log('Operation update Arrived to Finished done');
    } catch (error) {
      console.log(error);
    }
  });
  scheduledJobsFunc.start();
};
export const updatePendingToCanceledScheduleJobs =  () => {
  const scheduledJobsFunc = cron.schedule('0 1 * * *', async () => {
    console.log('Operation update Pending to Canceled begin');
    await DB.initialize();
    try {
      await DB.db.sequelize.transaction(async (t) => {
        await transactions.update(
          { paymentStatus: 'canceled' },
          {
            where: {
              paymentStatus: 'pending',
              updatedAt: { [Op.lte]: subDays(new Date(), 3) },
            },
            transaction: t,
          },
        );
      });
      console.log('Operation update Pending to Canceled done');
    } catch (error) {
      console.log(error);
    }
  });
  scheduledJobsFunc.start();
};
