import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface StableActions<K> {
  add: (key: K) => void;
  clear: () => void;
  remove: (key: K) => void;
  reset: () => void;
  set: Dispatch<SetStateAction<Set<K>>>;
  toggle: (key: K) => void;
}

export interface Actions<K> extends StableActions<K> {
  has: (key: K) => boolean;
}

const useSet = <K>(initialSet = new Set<K>()): [Set<K>, Actions<K>] => {
  const initialSetRef = useRef(initialSet);
  const [set, setSet] = useState(initialSet);

  const stableActions = useMemo<StableActions<K>>(() => {
    const add = (item: K) => setSet((prevSet) => new Set([...Array.from(prevSet), item]));
    const remove = (item: K) =>
      setSet((prevSet) => new Set(Array.from(prevSet).filter((i) => i !== item)));
    const toggle = (item: K) =>
      setSet((prevSet) =>
        prevSet.has(item)
          ? new Set(Array.from(prevSet).filter((i) => i !== item))
          : new Set([...Array.from(prevSet), item])
      );

    return { set: setSet, add, remove, toggle, reset: () => setSet(initialSetRef.current), clear: () => setSet(new Set()) };
  }, []);

  const utils = {
    has: useCallback((item) => set.has(item), [set]),
    ...stableActions,
  } as Actions<K>;

  return [set, utils];
};

export default useSet;