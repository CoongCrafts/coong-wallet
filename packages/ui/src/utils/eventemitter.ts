import EventEmitter from 'eventemitter3';

export const EventRegistry = new EventEmitter<EventName>();

export const triggerEvent = (name: EventName, ...args: any[]) => {
  EventRegistry.emit(name, ...args);
};

export const triggerEventFn = (name: EventName, ...args: any[]) => {
  return () => triggerEvent(name, ...args);
};

export enum EventName {
  OpenRemoveAccountDialog = 'OpenRemoveAccountDialog',
  OpenExportWalletDialog = 'OpenExportWalletDialog',
}
