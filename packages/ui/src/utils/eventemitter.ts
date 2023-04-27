import EventEmitter from 'eventemitter3';

export const EventRegistry = new EventEmitter<EventName>();

export const triggerEvent = (name: EventName, ...arg: any[]) => {
  EventRegistry.emit(name, ...arg);
};

export const triggerEventFn = (name: EventName, ...arg: any[]) => {
  return () => EventRegistry.emit(name, ...arg);
};

export enum EventName {
  OpenRemoveAccountDialog = 'OpenRemoveAccountDialog',
  OpenRenameAccountDialog = 'OpenRenameAccountDialog',
}
