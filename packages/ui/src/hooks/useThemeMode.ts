import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

export default function useThemeMode() {
  const { themeMode } = useSelector((state: RootState) => state.settings);

  return themeMode;
}
