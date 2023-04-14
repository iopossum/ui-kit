export interface IServerModelProps {
  type: string;
  caption: string;
  options?: unknown[];
  invisible?: boolean;
}

export interface IFrontModelProps {
  frontLookup?: boolean;
  editorOptions?: {
    items: IServerModelProps['options'];
  };
}

export const getColumns = (properties: Record<string, IServerModelProps & IFrontModelProps>) => {
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
