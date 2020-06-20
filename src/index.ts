import { styleModsFactory, withStyleMods } from './core';
import { CSSProperties } from 'react';

export const styleMods = styleModsFactory<CSSProperties>();

export { withStyleMods, styleModsFactory };
export type { ModsProps } from './types';
