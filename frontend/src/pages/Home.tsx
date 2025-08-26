import React from "react";
import AppNavigation from "../components/Navigation/AppNavigation";
import ProductList from "../components/ProductList";

const HomePage: React.FC = () => {
  return (
    <AppNavigation>
      <ProductList />
    </AppNavigation>
  );
};

export default HomePage;
