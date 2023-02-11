import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Products } from '../components/Header/Products/Products';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'hu', ['common']))
      // Will be passed to the page component as props
    }
  };
};

const HomePage: NextPage = () => {
  return <Products />;
};

export default HomePage;
