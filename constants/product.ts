import { StatusEnum, StatusType } from '../types/product';

export const availableProductStatuses: StatusType[] = [
  StatusEnum.AVAILABLE,
  StatusEnum.BOOKED,
  StatusEnum.SOLD
];
