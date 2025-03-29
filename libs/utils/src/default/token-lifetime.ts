import { DateUtils } from '../date/date.utils';

export const accessTokenLifetime = DateUtils.addHours(
  DateUtils.now(),
  1,
).toDate();

export const verificationTokenLifetime = DateUtils.addHours(
  DateUtils.now(),
  1,
).toDate();

export const autoDeleteTokenLifetime = DateUtils.addMonths(
  DateUtils.now(),
  1,
).toDate();
