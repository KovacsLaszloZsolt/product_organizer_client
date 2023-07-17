import { StatusType } from './product';

export enum LoadableState {
  LOADING = 'loading',
  HASDATA = 'hasData',
  ERROR = 'error'
}

export interface IntFilters {
  [FilterEnum.BRAND_ID]?: number[];
  [FilterEnum.CATEGORY_ID]?: number[];
  [FilterEnum.IMAGE_FOLDER]?: number[];
  [FilterEnum.OWNER_ID]?: number[];
  [FilterEnum.STATUS]?: StatusType[];
}

export enum FilterEnum {
  BRAND_ID = 'brandId',
  CATEGORY_ID = 'categoryId',
  IMAGE_FOLDER = 'imagesFolderId',
  OWNER_ID = 'ownerId',
  STATUS = 'status'
}

export type FilterType =
  | FilterEnum.BRAND_ID
  | FilterEnum.CATEGORY_ID
  | FilterEnum.IMAGE_FOLDER
  | FilterEnum.OWNER_ID
  | FilterEnum.STATUS;
