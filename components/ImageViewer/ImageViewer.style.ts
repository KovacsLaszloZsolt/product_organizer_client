import styled from '@emotion/styled';
import Breakpoints from '../../styles/Breakpoints';

export const ImageViewerWrapper = styled.span``;

export const ImageGalleryWrapper = styled.span`
  max-width: 225px;
  width: 100%;

  @media (max-width: ${Breakpoints.medium}) {
    margin: 0 auto;
    max-width: 400px;
  }

  .image-gallery-svg {
    height: 30px;
    width: 15px;
  }

  .image-gallery-thumbnail {
    width: 50px;
  }
`;
