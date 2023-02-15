import {
  useSelector as useReduxSelector,
  useDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
