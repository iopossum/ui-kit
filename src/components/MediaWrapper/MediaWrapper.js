import React from 'react';
import { useStores } from '@stores';
import Media from 'react-media';
import { MEDIA_QUERIES } from '@utils/Media';

export const MediaWrapper = ({ children }) => {
  const { AppStore } = useStores();
  return (
    <Media
      queries={MEDIA_QUERIES}
      onChange={matches => AppStore.matches = matches}
    >
      {matches => children}
    </Media>
  );
};
