import { DeleteOutline, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import { filter, forEach, isEqual, isNil, map } from 'lodash';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { createProduct, patchProduct } from '../../../api/product';
import { ImageTypeEnum, IntDeletedImage, IntProduct, StatusEnum } from '../../../types/product';
import { ContentCopy } from '../../ContentCopy/ContentCopy';
import { ImagesFolderSelector } from '../../ImagesFolderSelector/ImagesFolderSelector';
import { ProductCategorySelector } from '../../ProductCategorySelector/ProductCategorySelector';
import { ProductOwnerSelector } from '../../ProductOwnerSelector/ProductOwnerSelector';
import { ProductStatusSelector } from '../../ProductStatusSelector/ProductStatusSelector';
import { useProduct } from '../../commonHooks/useProduct';
import * as S from './ProductModal.styles';

interface ProductModalProps {
  product?: IntProduct | null;
  onClose: () => void;
}

interface Image {
  id: number | string;
  src: string;
  type: ImageTypeEnum;
  publicId?: string;
}

export const ProductModal = ({ product, onClose }: ProductModalProps): JSX.Element => {
  const { t } = useTranslation(['common', 'product']);
  const [files, setFiles] = useState<FileList | null>(null);
  const inputValue = '';
  const [deletedImages, setDeletedImages] = useState<IntDeletedImage[] | null>(null);

  const handleClose = (): void => {
    onClose();
    resetForm();
    setFiles(null);
    setDeletedImages(null);
  };

  const { mutateProduct, isMutateProductLoading } = useProduct({ afterOnSuccess: handleClose });

  const images = useMemo(() => {
    const oldImages = product?.images
      ?.filter((image) => !deletedImages?.map((deletedImage) => deletedImage.id).includes(image.id))
      .map((image) => {
        return {
          id: image.id,
          src: image.previewUrl,
          type: ImageTypeEnum.OLD,
          publicId: image.publicId
        };
      });

    const newImages = files
      ? map(files, (file, _key) => {
          return {
            id: file.name,
            src: URL.createObjectURL(file),
            type: ImageTypeEnum.NEW
          };
        })
      : [];

    return [...(oldImages ?? []), ...newImages];
  }, [files, product, deletedImages]);

  const handleFormSubmit = async (values: Partial<IntProduct>): Promise<void> => {
    if (product) {
      mutateProduct(async () =>
        patchProduct({ updateProduct: values, deletedImages, id: product.id, files })
      );
    } else {
      mutateProduct(async () => createProduct(values, files));
    }
  };

  const {
    errors,
    initialValues,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue
  } = useFormik({
    initialValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ?? null,
      size: product?.size ?? null,
      ownerId: product?.ownerId ?? null,
      categoryId: product?.categoryId ?? null,
      status: product?.status ?? StatusEnum.AVAILABLE,
      imagesFolderId: product?.imagesFolderId ?? null
    },
    validationSchema: Yup.object({
      name: Yup.string().required(
        t('common:error.isRequired', { field: t('product:product.name') }) ?? ''
      )
    }),
    onSubmit: async (values) => {
      await handleFormSubmit(values);
    }
  });

  const handleDeleteImageClick = (image: Image): void => {
    if (image.type === ImageTypeEnum.NEW) {
      if (isNil(files)) {
        return;
      }

      const updatedList = {} as FileList;

      forEach(files, (value, key) => {
        if (value.name === image.id) {
          return;
        }

        updatedList[key] = value;
      });

      setFiles(updatedList);
    }

    setDeletedImages((prev) => [
      ...(prev ?? []),
      { id: image.id as number, publicId: image.publicId as string }
    ]);
  };

  return (
    <div>
      <Dialog open={true} onClose={onClose} disableScrollLock fullWidth maxWidth="md">
        <DialogTitle>{t(`product:product.${product ? 'edit' : 'create'}`)}</DialogTitle>
        <DialogContent>
          <S.Form noValidate>
            <S.InputWrapper>
              <S.InputField
                id="name"
                name="name"
                type="text"
                label={t('product:product.name')}
                size="small"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={!!(touched.name && errors.name)}
                helperText={touched.name && errors.name && <>{errors.name}</>}
                required
                fullWidth
              />
              <ContentCopy value={values.name} />
            </S.InputWrapper>
            <S.InputWrapper>
              <S.InputField
                id="description"
                variant="outlined"
                label={t('product:product.description')}
                multiline
                fullWidth
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                error={!!(touched.description && errors.description)}
                helperText={errors.description}
              />
              <ContentCopy value={values.description} />
            </S.InputWrapper>
            <ProductStatusSelector
              status={values.status}
              onChange={(e): void => {
                setFieldValue('status', e.target.value);
              }}
              style={{ width: '100%', marginBottom: '2rem' }}
            />
            <S.InputWrapper>
              <S.InputField
                id="price"
                type="number"
                variant="outlined"
                label={t('product:product.price')}
                fullWidth
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.price ?? ''}
                error={!!(touched.price && errors.price)}
                helperText={errors.price}
              />
              <ContentCopy value={`${values.price}`} />
            </S.InputWrapper>
            <S.SelectContainer>
              <ProductCategorySelector
                value={values.categoryId}
                onChange={(e): void => {
                  setFieldValue('categoryId', +e.target.value);
                }}
              />
            </S.SelectContainer>

            <S.InputWrapper>
              <S.InputField
                id="size"
                type="number"
                variant="outlined"
                label={t('product:product.size')}
                fullWidth
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.size ?? ''}
                error={!!(touched.size && errors.size)}
                helperText={errors.size}
              />
              <ContentCopy value={`${values.size}`} />
            </S.InputWrapper>

            <ProductOwnerSelector
              owner={values.ownerId}
              onChange={(e): void => {
                setFieldValue('ownerId', Number(e.target?.value));
              }}
              style={{ width: '100%', marginBottom: '2rem' }}
            />

            <ImagesFolderSelector
              imagesFolder={values.imagesFolderId}
              onChange={(e): void => {
                setFieldValue('imagesFolderId', Number(e.target?.value));
              }}
              style={{ width: '100%', marginBottom: '2rem' }}
            />

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="files"
              multiple
              type="file"
              value={inputValue}
              onChange={(e): void => {
                let newFiles = e.target.files;
                newFiles = newFiles
                  ? Object.assign(
                      {},
                      ...filter(newFiles, (file) => !map(files, 'name').includes(file.name)).map(
                        (file, index) => ({ [index]: file })
                      )
                    )
                  : files;

                if (!newFiles) {
                  return;
                }

                const newFilesWithModifiedKey = {} as FileList;

                forEach(newFiles, (value, key) => {
                  newFilesWithModifiedKey[key + Object.keys(files ?? {}).length] = value;
                });

                setFiles((prev) => {
                  return { ...(prev ?? {}), ...newFilesWithModifiedKey };
                });
              }}
            />
            <label htmlFor="files">
              <Button variant="outlined" component="span">
                {t('common:uploadImages')}
              </Button>
            </label>
          </S.Form>
          <>
            {!isNil(images) &&
              images.map((image) => {
                return (
                  <S.ImageWrapper key={image.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} height={225} alt={'image'} />
                    <S.CustomTooltip title={t('common:delete')}>
                      <IconButton
                        sx={{
                          color: 'white',

                          '&:hover': {
                            color: 'red'
                          }
                        }}
                        onClick={(): void => {
                          handleDeleteImageClick(image);
                        }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </S.CustomTooltip>
                  </S.ImageWrapper>
                );
              })}
          </>
        </DialogContent>
        <DialogActions style={{ marginRight: '1rem' }}>
          <Button color="error" onClick={handleClose}>
            {t('common:cancel')}
          </Button>
          <LoadingButton
            loading={isMutateProductLoading}
            loadingPosition="start"
            startIcon={<Save />}
            variant="outlined"
            type="submit"
            onClick={(): void => {
              handleSubmit();
            }}
            disabled={
              (isEqual(values, initialValues) && isNil(files) && isNil(deletedImages)) ||
              !!Object.keys(errors).length
            }
          >
            {t('common:save')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
