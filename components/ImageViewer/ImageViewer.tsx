import { isEmpty } from 'lodash';
import Image from 'next/image';
import { useMemo } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import * as S from './ImageViewer.style';
import { IntImage } from '../../types/product';

interface ImageViewerProps {
  images: IntImage[] | undefined;
}

export const ImageViewer = ({ images }: ImageViewerProps): JSX.Element => {
  const galleryImages = useMemo(
    () =>
      images?.map((image) => ({
        original: image.fullSizeUrl,
        thumbnail: image.previewUrl,
        thumbnailHeight: 50,
        thumbnailWidth: 50
      })) ?? [],
    [images]
  );

  if (isEmpty(galleryImages)) {
    return <Image src={'/images/noImage.png'} width={225} height={225} alt="" />;
  }

  return (
    <S.ImageGalleryWrapper>
      <ImageGallery items={galleryImages} />
    </S.ImageGalleryWrapper>
  );
};
