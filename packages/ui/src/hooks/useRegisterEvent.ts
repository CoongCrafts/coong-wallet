import { useEffectOnce } from 'react-use';
import { EventName, EventRegistry } from 'utils/eventemitter';

export default function useRegisterEvent(event: EventName, fn: (...arg: any[]) => void) {
  useEffectOnce(() => {
    EventRegistry.on(event, fn);
    return () => {
      EventRegistry.off(event, fn);
    };
  });
}
