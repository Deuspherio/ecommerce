import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const ProductLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-[90px]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default ProductLayout;
