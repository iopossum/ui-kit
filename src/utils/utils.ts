export interface IMakeDebounceCfg {
  wait?: number;
  immediate?: boolean;
}

export const makeDebounce = <T>(fn: (...a: unknown[]) => T, cfg?: IMakeDebounceCfg) => {
  let timeout: ReturnType<typeof setTimeout>;
  const { wait, immediate } = cfg || ({} as IMakeDebounceCfg);
  return {
    cancel: () => {
      clearTimeout(timeout);
    },
    debounce: function (...args: unknown[]) {
      const later = () => {
        fn.apply(this, args);
      };
      if (immediate) {
        later();
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 0);
      }
    },
  };
};

export const makeAbortable = <T>(fn: (...a: unknown[]) => Promise<T>) => {
  let outerReject: (value: unknown) => void;
  return {
    abort: () => {
      outerReject && outerReject({ aborted: true });
    },
    execute: function (...args: unknown[]) {
      return new Promise((resolve, reject) => {
        outerReject = reject;
        fn.apply(this, args).then(resolve).catch(outerReject);
      });
    },
  };
};
