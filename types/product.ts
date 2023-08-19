export interface IntProduct {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string | null;
  price: number | null;
  brandId: number | null;
  ownerId: number | null;
  categoryId: number | null;
  deleted_at: Date;
  status: StatusType;
  images?: IntImage[];
  imagesFolderId?: number | null;
  note?: string | null;
}

export type StatusType = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export enum StatusEnum {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  SOLD = 'SOLD'
}

export enum StatusColorEnum {
  AVAILABLE = 'success',
  BOOKED = 'warning',
  SOLD = 'error'
}

export interface IntImage {
  id: number;
  publicId: string;
  previewUrl: string;
  fullSizeUrl: string;
}

export interface IntDeletedImage {
  id: number;
  publicId: string;
}

export enum ImageTypeEnum {
  NEW = 'new',
  OLD = 'old'
}

export type ImageType = ImageTypeEnum.NEW | ImageTypeEnum.OLD;

export interface ProductSelectFieldOptions {
  id: number | StatusType;
  name: string;
}

export interface IntProductBrand {
  id: number;
  name: string;
}

export interface IntProductCategory {
  id: number;
  name: string;
}

export interface IntProductOwner {
  id: number;
  name: string;
}

export interface IntImagesFolder {
  id: number;
  name: string;
}

export enum SelectTypeEnum {
  BRAND = 'brand',
  CATEGORY = 'category',
  IMAGES_FOLDER = 'imagesFolder',
  OWNER = 'owner',
  STATUS = 'status'
}

export type SelectType =
  | SelectTypeEnum.BRAND
  | SelectTypeEnum.CATEGORY
  | SelectTypeEnum.IMAGES_FOLDER
  | SelectTypeEnum.OWNER
  | SelectTypeEnum.STATUS;
