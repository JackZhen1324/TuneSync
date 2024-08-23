import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { MyModuleViewProps } from './MyModule.types';

const NativeView: React.ComponentType<MyModuleViewProps> =
  requireNativeViewManager('MyModule');

export default function MyModuleView(props: MyModuleViewProps) {
  return <NativeView {...props} />;
}
