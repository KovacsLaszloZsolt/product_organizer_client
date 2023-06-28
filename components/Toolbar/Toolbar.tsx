import { Check, Clear } from '@mui/icons-material';
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
import { useImagesFolderSelector } from '../ImagesFolderSelector/useImagesFolderSelector';
import { useProductCategory } from '../ProductCategorySelector/useProductCategory';
import { useProductOwner } from '../ProductOwnerSelector/useProductOwner';
import { useUser } from '../commonHooks/useUser';
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
  const { user } = useUser();
  const { filters, setFilters, isToolbarOpen, setIsToolbarOpen } = useProductsStore();

  const { values, resetForm, setFieldValue } = useFormik({
    initialValues: {
      ownerId: filters?.ownerId ?? [],
      categoryId: filters?.categoryId ?? [],
      status: filters?.status ?? [],
      imagesFolderId: filters?.imagesFolderId ?? []
    },
    onSubmit: (_values) => {}
  });

  const handleChange = (event: SelectChangeEvent<(number | StatusType)[]>, key: string): void => {
    const {
      target: { value }
    } = event;

    setFieldValue(key, typeof value === 'string' ? value.split(',').map((id) => +id) : value);
  };

  const handleSave = (): void => {
    setFilters(values);
  };

  const handleDelete = (): void => {
    resetForm({ ownerId: [], categoryId: [], status: [], imagesFolderId: [] } as IntFormValues);
    setFilters({});
  };

  const selectOptions = useMemo(() => {
    return [
      {
        options: productOwners,
        type: 'owner',
        values: values.ownerId,
        valuesKey: 'ownerId',
        role: RoleEnum.ADMIN
      },
      {
        options: categories,
        type: 'category',
        values: values.categoryId,
        valuesKey: 'categoryId',
        role: RoleEnum.ADMIN
      },
      {
        options: [
          { id: StatusEnum.AVAILABLE, name: t(`common:status.${StatusEnum.AVAILABLE}`) },
          { id: StatusEnum.BOOKED, name: t(`common:status.${StatusEnum.BOOKED}`) },
          { id: StatusEnum.SOLD, name: t(`common:status.${StatusEnum.SOLD}`) }
        ],
        type: 'status',
        values: values.status,
        valuesKey: 'status',
        role: RoleEnum.BASIC
      },
      {
        options: imagesFolders,
        type: 'imagesFolder',
        values: values.imagesFolderId,
        valuesKey: 'imagesFolderId',
        role: RoleEnum.ADMIN
      }
    ];
  }, [productOwners, values, imagesFolders, categories]);

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
                handleChange={handleChange}
              />
            );
          })}
        </S.Wrapper>
      )}
      <S.ActionButtonsWrapper>
        {isToolbarOpen && (
          <S.FormButtons
            isVisible={
              !isEqual(
                omitBy(values, isEmpty),
                omitBy(filters, (item) => isEmpty(item))
              )
            }
          >
            <IconButton
              aria-label={t(`common:toolbar.button.apply`) || undefined}
              onClick={handleSave}
            >
              <Check color="success" />
            </IconButton>
            <IconButton
              aria-label={t(`common:toolbar.button.delete`) || undefined}
              onClick={handleDelete}
            >
              <Clear color="error" />
            </IconButton>
          </S.FormButtons>
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
