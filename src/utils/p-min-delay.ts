import delay from 'delay';
import type { Options } from 'delay';

export const pMinDelay = async (
  promise: Promise<unknown>,
  minimumDelay: number,
  options?: Options & { delayRejection?: boolean },
) => {
  options = {
    delayRejection: true,
    ...options,
  };

  let promiseError;

  if (options.delayRejection) {
    promise = promise.catch((error) => {
      promiseError = error;
    });
  }

  const value = await Promise.all([promise, delay(minimumDelay)]);
  return promiseError ? Promise.reject(promiseError) : value[0];
};
