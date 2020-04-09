import { createContext, useContext } from 'react';
import { notification, message } from 'antd';

export type NotifType = 'success' | 'error' | 'info' | 'open';
export type MessageType = 'success' | 'error' | 'info';

interface INotifContext {
  openNotification: (message: string, description: string, type: NotifType) => void;
  openMessage: (content: string, type: MessageType) => void;
}

const openNotification = (message: string, description: string, type: NotifType) => {
  notification[type]({
    message,
    description,
    duration: 5,
  });
};

const openMessage = (content: string, type: MessageType) => {
  message[type](content);
};

export const NotifContext = createContext<INotifContext>({ openNotification, openMessage });

export const useNotif = () => useContext(NotifContext);
