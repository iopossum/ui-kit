import React, { memo } from 'react';
import Media from 'react-media';

import { useAppStore } from '@stores';

import { MEDIA_QUERIES } from '@utils/media';

export const MediaWrapper = ({ children }: React.PropsWithChildren) => {
  const AppStore = useAppStore();
  return (
    <Media queries={MEDIA_QUERIES} onChange={(matches) => (AppStore.matches = matches)}>
      {() => children}
    </Media>
  );
};

export const MediaWrapperMemo = memo(MediaWrapper);
