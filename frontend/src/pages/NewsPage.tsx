import React from "react";
import AppNavigation from "../components/Navigation/AppNavigation";
import News from "../components/News";

const NewsPage: React.FC = () => {
  return (
    <AppNavigation>
      <News />
    </AppNavigation>
  );
};

export default NewsPage;
