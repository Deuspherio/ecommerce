import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useContext } from "react";
import { Store } from "../context";

const AdminLayout = () => {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  return (
    <>
      <Header />
      <div className="pt-[90px]">
        <Outlet />
      </div>
      {(userData && !userData.isAdmin) || !userData ? <Footer /> : null}
    </>
  );
};

export default AdminLayout;
