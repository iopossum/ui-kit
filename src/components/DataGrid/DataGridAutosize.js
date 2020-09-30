import React, { useRef, useEffect } from 'react';
import { string, number, oneOfType, element, node, object, array, func, bool } from 'prop-types';
import { DataGrid } from '@components/DataGrid';
import { AutoSizer } from 'react-virtualized';

export const DataGridAutosize = ({
  ...props
}) => {

  return (
    <AutoSizer disableWidth>
      {({ height }) => {
        return (
          <DataGrid
            height={height}
            {...props}
          />
        );
      }}
    </AutoSizer>
  )
};


DataGridAutosize.propTypes = {
  ...DataGrid.propTypes
};

DataGridAutosize.defaultProps = {
  ...DataGrid.defaultProps
};
