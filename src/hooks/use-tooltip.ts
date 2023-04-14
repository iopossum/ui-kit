import React, { useState, useCallback } from 'react';

interface IUseTooltip {
  (props: { disabled?: boolean }): {
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    visible: boolean;
  };
}

export const useTooltip: IUseTooltip = ({ disabled }) => {
  const [visible, setVisible] = useState(false);
  const onMouseEnter = useCallback(() => {
    !disabled && setVisible(true);
  }, [disabled]);
  const onMouseLeave = useCallback(() => {
    !disabled && setVisible(false);
  }, [disabled]);
  return {
    onMouseEnter,
    onMouseLeave,
    visible,
  };
};