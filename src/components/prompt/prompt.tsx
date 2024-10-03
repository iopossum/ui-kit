import React, { memo } from 'react';
import { useBlocker } from 'react-router-dom';

export interface IPromptProps {
  when: boolean;
  message: string;
}

export const Prompt = (props: IPromptProps) => {
  const block = props.when;

  useBlocker(() => {
    if (block) {
      return !window.confirm(props.message);
    }
    return false;
  });

  return <div key={String(block)} />;
};

export const PromptMemo = memo(Prompt);
