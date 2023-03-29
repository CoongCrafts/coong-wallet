import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce, useIdle } from 'react-use';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';

export default function useLockTimer() {
  const { locked, lastUsedAt } = useSelector((state: RootState) => state.app);
  const { autoLockInterval } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const idle = useIdle(30e3);

  useEffectOnce(() => {
    if (locked || !lastUsedAt) {
      return;
    }

    if (lastUsedAt + autoLockInterval < Date.now()) {
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

      if (counter > autoLockInterval) {
        dispatch(appActions.lock());
      }
    }, 1000);

    return () => clearInterval(lockIntervalTimer);
  }, [idle, locked]);
}
