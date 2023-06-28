import { forEach, isEmpty, isNil } from 'lodash';
import { FilterType, IntFilters } from '../types/common';
import {
  IntDeletedImage,
  IntImagesFolder,
  IntProduct,
  IntProductCategory,
  IntProductOwner
} from '../types/product';
import { api, unprotectedApi } from './api';

export const getProducts = async (
  filters?: IntFilters,
  searchValue?: string
): Promise<IntProduct[] | undefined> => {
  const params = Object.keys(filters ?? {}).reduce((acc, key) => {
    const _key = key as FilterType;
    const value = filters?.[_key];

    if (!value || !value.length) {
      return acc;
    }
    acc[_key] = value.join(',');
    return acc;
  }, {} as Partial<Record<FilterType | 'search', string>>);

  if (searchValue) {
    params.search = searchValue;
  }

  const { data } = await unprotectedApi.get('/api/product', { params });

  console.log({ data });
  return data;
};

export const getProduct = async (id?: number): Promise<IntProduct | undefined> => {
  if (isNil(id)) {
    throw new Error('Missing product id');
  }

  const { data } = await unprotectedApi.get(`/api/product/${id}`);
  return data;
};

export const createProduct = async (
  newProduct: Partial<IntProduct>,
  files: FileList | null
): Promise<IntProduct> => {
  const formData = new FormData();

  forEach(newProduct, (value, key) => {
    if (isNil(value)) {
      return;
    }
    formData.append(key, `${value}`);
  });

  if (!isNil(files) && !isEmpty(files)) {
    Object.values(files).forEach((file) => {
      formData.append('files', file);
    });
  }

  const { data } = await api.post('/api/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data;
};

export const patchProduct = async ({
  updateProduct,
  id,
  files,
  deletedImages
}: {
  updateProduct: Partial<IntProduct & { deletedImages: IntDeletedImage[] | null }>;
  id: number;
  files?: FileList | null;
  deletedImages?: IntDeletedImage[] | null;
}): Promise<IntProduct> => {
  const formData = new FormData();

  forEach(updateProduct, (value, key) => {
    if (isNil(value)) {
      return;
    }

    formData.append(key, `${value}`);
  });

  if (!isNil(files) && !isEmpty(files)) {
    Object.values(files).forEach((file) => {
      formData.append('files', file);
    });
  }

  if (!isNil(deletedImages)) {
    formData.append(`deletedImages`, JSON.stringify(deletedImages));
  }

  const { data } = await api.patch(`/api/product/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data;
};

export const fetchCategories = async (): Promise<IntProductCategory[]> => {
  const { data } = await api.get(`/api/category`);
  return data;
};

export const createProductCategory = async (name: string): Promise<IntProductCategory> => {
  const { data } = await api.post(`/api/category`, { name });
  return data;
};

export const fetchProductOwners = async (): Promise<IntProductOwner[] | undefined> => {
  const { data } = await api.get(`/api/owner`);
  return data;
};

export const createProductOwner = async (name: string): Promise<IntProductOwner> => {
  const { data } = await api.post(`/api/owner`, { name });
  return data;
};

export const deleteProduct = async (id: number): Promise<IntProduct> => {
  const { data } = await api.delete(`/api/product/${id}`);
  return data;
};

export const fetchImagesFolders = async (): Promise<IntImagesFolder[] | undefined> => {
  const { data } = await api.get(`/api/image/folder`);

  return data;
};

export const postImageFolder = async (name: string): Promise<IntImagesFolder> => {
  const { data } = await api.post(`/api/image/folder`, { name });

  return data;
};
