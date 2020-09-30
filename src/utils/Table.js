export const getColumns = (properties) => {
  return Object.entries(properties).map(([key, value]) => {
    if (value.options && Array.isArray(value.options) && value.options.length) {
      value.frontLookup = true;
      value.editorOptions = {
        items: value.options,
      };
    }
    return {
      ...value,
      visible: !value.invisible,
      dataField: key,
    };
  });
};
