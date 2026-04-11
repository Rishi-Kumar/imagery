import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;
export const SCREEN_HEIGHT = window.height;
export const GRID_COLUMNS = 3;
export const GRID_GAP = 2;
export const TILE_SIZE = (SCREEN_WIDTH - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

export const THUMBNAIL_TARGET_PX = Math.round(TILE_SIZE * PixelRatio.get());
export const PREVIEW_TARGET_PX = Math.round(SCREEN_WIDTH * PixelRatio.get());
