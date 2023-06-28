import { StatusType } from './product';

export enum LoadableState {
  LOADING = 'loading',
  HASDATA = 'hasData',
  ERROR = 'error'
}

export interface IntFilters {
  [FilterEnum.OWNER_ID]?: number[];
  [FilterEnum.CATEGORY_ID]?: number[];
  [FilterEnum.STATUS]?: StatusType[];
  [FilterEnum.IMAGE_FOLDER]?: number[];
}

export enum FilterEnum {
  OWNER_ID = 'ownerId',
  CATEGORY_ID = 'categoryId',
  STATUS = 'status',
  IMAGE_FOLDER = 'imagesFolderId'
}

export type FilterType = FilterEnum.OWNER_ID | FilterEnum.CATEGORY_ID | FilterEnum.STATUS;
