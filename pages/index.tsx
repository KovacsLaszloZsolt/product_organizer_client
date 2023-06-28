import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient, dehydrate } from 'react-query';

import { getProducts } from '../api/product';
import { Header } from '../components/Header/Header';
import { ProductList } from '../components/ProductList/ProductList';
import { useProductsStore } from '../store/home';
import { MainContentWrapper } from '../styles/globalStyles';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['products', {}, ''], () => getProducts({}, ''));

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'hu', ['common', 'product'])),
      dehydratedState: dehydrate(queryClient)
      // Will be passed to the page component as props
    }
  };
};

const HomePage: NextPage = () => {
  const { isToolbarOpen } = useProductsStore();

  return (
    <div>
      <Header />
      <MainContentWrapper isToolbarOpen={!!isToolbarOpen}>
        <ProductList />
      </MainContentWrapper>
    </div>
  );
};

export default HomePage;
