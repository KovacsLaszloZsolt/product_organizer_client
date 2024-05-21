import { DeleteOutline, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Switch
} from '@mui/material';
import { useFormik } from 'formik';
import { filter, forEach, isEqual, isNil, map } from 'lodash';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { createProduct, patchProduct } from '../../../api/product';
import { availableProductStatuses } from '../../../constants/product';
import {
  ImageTypeEnum,
  IntDeletedImage,
  IntProduct,
  SelectTypeEnum,
  StatusEnum
} from '../../../types/product';
import { modalOnCloseHandler } from '../../../utils/modalOnCloseHandler';
import { ContentCopy } from '../../ContentCopy/ContentCopy';
import { useImagesFolderSelector } from '../../ImagesFolderSelector/useImagesFolderSelector';
import { ProductSelectField } from '../../ProductSelectField/ProductSelectField';
import { useProduct } from '../../hooks/useProduct';
import { useProductBrand } from '../../hooks/useProductBrand';
import { useProductCategory } from '../../hooks/useProductCategory';
import { useProductOwner } from '../../hooks/useProductOwner';
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
  const { imagesFolders, createdImagesFolder, createImageFolder } = useImagesFolderSelector();
  const { productOwners, createdOwner, createProductOwner } = useProductOwner();
  const { categories, createdCategory, createCategory } = useProductCategory();
  const { brands, createdBrand, createBrand } = useProductBrand();

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
      brandId: product?.brandId ?? null,
      ownerId: product?.ownerId ?? null,
      categoryId: product?.categoryId ?? null,
      status: product?.status ?? StatusEnum.AVAILABLE,
      imagesFolderId: product?.imagesFolderId ?? null,
      withDelivery: product?.withDelivery ?? true
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

  useEffect(() => {
    if (!createdCategory) return;

    setFieldValue('categoryId', createdCategory.id);
  }, [createdCategory]);

  useEffect(() => {
    if (!createdBrand) return;

    setFieldValue('brandId', createdBrand.id);
  }, [createdBrand]);

  useEffect(() => {
    if (!createdImagesFolder) return;

    setFieldValue('imagesFolderId', createdImagesFolder.id);
  }, [createdImagesFolder]);

  useEffect(() => {
    if (!createdOwner) return;

    setFieldValue('ownerId', createdOwner.id);
  }, [createdOwner]);

  return (
    <div>
      <Dialog
        open={true}
        onClose={(e: Event, reason: string): void => modalOnCloseHandler(e, reason, onClose)}
        disableScrollLock
        fullWidth
        maxWidth="md"
      >
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
            <S.MultipleRowContainer>
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
                  style={!product ? { marginBottom: '0.50625rem' } : {}}
                />
                <ContentCopy value={values.description} />
              </S.InputWrapper>
              {!product && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.withDelivery}
                      onClick={(): void => {
                        setFieldValue('withDelivery', !values.withDelivery);
                      }}
                    />
                  }
                  label={t('product:withDelivery')}
                  labelPlacement="start"
                />
              )}
            </S.MultipleRowContainer>

            <ProductSelectField
              options={availableProductStatuses.map((status) => ({ id: status, name: status }))}
              type={SelectTypeEnum.STATUS}
              value={values.status}
              defaultValue={StatusEnum.AVAILABLE}
              onChange={(value): void => {
                setFieldValue('status', value);
              }}
              style={{ width: '100%' }}
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
                onWheel={(e): void => (e.target as HTMLInputElement).blur()}
              />
              <ContentCopy value={`${values.price}`} />
            </S.InputWrapper>

            <ProductSelectField
              allowedNewValue
              options={categories}
              type={SelectTypeEnum.CATEGORY}
              value={values.categoryId}
              onChange={(value): void => {
                setFieldValue('categoryId', Number(value));
              }}
              onNewSelectValueSubmit={(value): void => {
                createCategory(value);
              }}
              style={{ width: '100%' }}
            />

            <ProductSelectField
              allowedNewValue
              options={brands}
              type={SelectTypeEnum.BRAND}
              value={values.brandId}
              onChange={(value): void => {
                setFieldValue('brandId', Number(value));
              }}
              onNewSelectValueSubmit={(value): void => {
                createBrand(value);
              }}
              style={{ width: '100%' }}
            />

            <ProductSelectField
              allowedNewValue
              options={productOwners}
              type={SelectTypeEnum.OWNER}
              value={values.ownerId}
              onChange={(value): void => {
                setFieldValue('ownerId', Number(value));
              }}
              onNewSelectValueSubmit={(value): void => {
                createProductOwner(value);
              }}
              style={{ width: '100%' }}
            />

            <ProductSelectField
              allowedNewValue
              options={imagesFolders}
              type={SelectTypeEnum.IMAGES_FOLDER}
              value={values.imagesFolderId}
              onChange={(value): void => {
                setFieldValue('imagesFolderId', Number(value));
              }}
              onNewSelectValueSubmit={(value): void => {
                createImageFolder(value);
              }}
              style={{ width: '100%' }}
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
          <Button color="error" onClick={handleClose} disabled={isMutateProductLoading}>
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
