import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce, useIdle } from 'react-use';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';

const UNLOCK_INTERVAL = 5 * 60 * 1e3; // 5 minutes

export default function useLockTimer() {
  const { locked, lastUsedAt } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const idle = useIdle(30e3);

  useEffectOnce(() => {
    if (locked || !lastUsedAt) {
      return;
    }

    if (lastUsedAt + UNLOCK_INTERVAL < Date.now()) {
      dispatch(appActions.lock());
    }
  });

  useEffectOnce(() => {
    window.addEventListener('beforeunload', () => {
      dispatch(appActions.recordLastUsedAt());
    });
  });

  useEffect(() => {
    if (!idle || locked) {
      return;
    }

    let counter = 0;
    const lockIntervalTimer = setInterval(() => {
      counter += 1e3;

      if (counter > UNLOCK_INTERVAL) {
        dispatch(appActions.lock());
      }
    }, 1000);

    return () => clearInterval(lockIntervalTimer);
  }, [idle, locked]);
}
