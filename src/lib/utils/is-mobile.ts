import { useMediaQuery } from 'your-media-query-library';

export const getIsMobile = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile;
};