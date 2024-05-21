import TuneIcon from '@mui/icons-material/Tune';
import { SelectChangeEvent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import { isEmpty, isEqual, omitBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useProductsStore } from '../../store/home';
import { RoleEnum } from '../../types/auth';
import { StatusEnum, StatusType } from '../../types/product';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import { useImagesFolderSelector } from '../ImagesFolderSelector/useImagesFolderSelector';
import { useProductBrand } from '../hooks/useProductBrand';
import { useProductCategory } from '../hooks/useProductCategory';
import { useProductOwner } from '../hooks/useProductOwner';
import { useUser } from '../hooks/useUser';
import * as S from './Toolbar.styles';
import { ToolbarMultiSelect } from './ToolbarMultiSelect';

interface IntFormValues {
  ownerId: number[];
  categoryId: number[];
  status: StatusType[];
  imagesFolderId: number[];
}

export const Toolbar = (): JSX.Element => {
  const { t } = useTranslation('product');
  const { productOwners } = useProductOwner();
  const { categories } = useProductCategory();
  const { imagesFolders } = useImagesFolderSelector();
  const { brands } = useProductBrand();
  const { user } = useUser();
  const { filters, setFilters, isToolbarOpen, setIsToolbarOpen } = useProductsStore();

  const { values, resetForm, setFieldValue } = useFormik({
    initialValues: {
      brandId: filters?.brandId ?? [],
      categoryId: filters?.categoryId ?? [],
      imagesFolderId: filters?.imagesFolderId ?? [],
      ownerId: filters?.ownerId ?? [],
      status: filters?.status ?? []
    },
    onSubmit: (_values) => {}
  });

  const isFormActionButtonsVisible = useMemo(() => {
    return !isEqual(
      omitBy(values, isEmpty),
      omitBy(filters, (item) => isEmpty(item))
    );
  }, [values, filters]);
  const handleChange = (event: SelectChangeEvent<(number | StatusType)[]>, key: string): void => {
    const {
      target: { value }
    } = event;

    setFieldValue(key, typeof value === 'string' ? value.split(',').map((id) => +id) : value);
  };

  const handleSave = (): void => {
    setFilters(values);
  };

  const handleCancel = (): void => {
    resetForm({ ownerId: [], categoryId: [], status: [], imagesFolderId: [] } as IntFormValues);
    setFilters({});
  };

  const selectOptions = useMemo(() => {
    return [
      {
        options: brands,
        type: 'brand',
        values: values.brandId,
        valuesKey: 'brandId',
        role: RoleEnum.BASIC,
        withNullValue: true
      },
      {
        options: productOwners,
        type: 'owner',
        values: values.ownerId,
        valuesKey: 'ownerId',
        role: RoleEnum.ADMIN,
        withNullValue: true
      },
      {
        options: categories,
        type: 'category',
        values: values.categoryId,
        valuesKey: 'categoryId',
        role: RoleEnum.BASIC,
        withNullValue: true
      },
      {
        options: [
          { id: StatusEnum.AVAILABLE, name: t(`common:status.${StatusEnum.AVAILABLE}`) },
          { id: StatusEnum.BOOKED, name: t(`common:status.${StatusEnum.BOOKED}`) },
          { id: StatusEnum.SOLD, name: t(`common:status.${StatusEnum.SOLD}`) },
          { id: StatusEnum.POST, name: t(`common:status.${StatusEnum.POST}`) },
          { id: StatusEnum.PENDING, name: t(`common:status.${StatusEnum.PENDING}`) }
        ],
        type: 'status',
        values: values.status,
        valuesKey: 'status',
        role: RoleEnum.BASIC,
        withNullValue: false
      },
      {
        options: imagesFolders,
        type: 'imagesFolder',
        values: values.imagesFolderId,
        valuesKey: 'imagesFolderId',
        role: RoleEnum.ADMIN,
        withNullValue: true
      }
    ];
  }, [productOwners, values, imagesFolders, categories, brands]);

  return (
    <S.Toolbar>
      {isToolbarOpen && (
        <S.Wrapper noValidate>
          {selectOptions.map((option) => {
            if (option.role === RoleEnum.ADMIN && (!user || user?.role !== RoleEnum.ADMIN)) {
              return null;
            }

            return (
              <ToolbarMultiSelect
                key={option.type}
                options={option.options ?? []}
                type={option.type}
                values={option.values}
                valuesKey={option.valuesKey}
                withNullValue={option.withNullValue}
                handleChange={handleChange}
              />
            );
          })}
        </S.Wrapper>
      )}
      <S.ActionButtonsWrapper>
        {isToolbarOpen && (
          <ActionButtons
            isVisible={isFormActionButtonsVisible}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />
        )}
        <IconButton
          aria-label={t(`common:toolbar.button.filter`) || undefined}
          onClick={(): void => {
            setIsToolbarOpen(!isToolbarOpen);
          }}
        >
          <TuneIcon />
        </IconButton>
      </S.ActionButtonsWrapper>
    </S.Toolbar>
  );
};
