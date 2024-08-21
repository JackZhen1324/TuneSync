import * as React from 'react';

import { MyModuleViewProps } from './MyModule.types';

export default function MyModuleView(props: MyModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
