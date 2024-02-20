import cron from 'node-cron';
import transactions from '../../models/transactions.model';
import { Op } from 'sequelize';
import {  subDays } from 'date-fns';

export const initScheduleJobs = async () => {
  const scheduledJobsFunc = cron.schedule('* * * * *', async () => {
    console.log("I'm executed on a schedule!");
    try {
      const transData = await transactions.findAll({
        where: {
          paymentStatus: 'arrived',
          updatedAt: { [Op.lte]: subDays(new Date(), 3) },
        },
        raw: true,
      });
      console.log('🚀 ~ scheduledJobsFunc ~ transData:', transData);
    } catch (error) {
      console.log(error);
    }
  });
  scheduledJobsFunc.start();
};
