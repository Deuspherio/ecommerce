import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useContext } from "react";
import { Store } from "../context";
import MessageBox from "./MessageBox";

const UserLayout = () => {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  return (
    <>
      <div className="custom-container lg:hidden">
        <MessageBox info>
          We recommend wider screen devices to view this website.
        </MessageBox>
      </div>
      <div className="hidden lg:block">
        <Header />
        <div className="pt-[90px]">
          <Outlet />
        </div>
        {(userData && !userData.isAdmin) || !userData ? <Footer /> : null}
      </div>
    </>
  );
};

export default UserLayout;
