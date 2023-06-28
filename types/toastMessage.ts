export type ToastMessageType = 'success' | 'error' | 'warning' | 'info';

export enum ToastMessageTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface IntToastMessage {
  type: ToastMessageType;
  message: string;
}
