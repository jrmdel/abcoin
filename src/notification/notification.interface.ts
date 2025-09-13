export interface INotificationProvider {
  sendNotification(message: string): Promise<void>;
}
