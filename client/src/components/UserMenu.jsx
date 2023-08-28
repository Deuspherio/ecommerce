import React from "react";
import UserDropDown from "./UserDropDown";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { BsCart } from "react-icons/bs";

const UserMenu = ({ userData, signoutHandler, cartItems }) => {
  return (
    <>
      {userData && userData.isAdmin ? (
        <ul>
          <li>
            <UserDropDown userData={userData} signoutHandler={signoutHandler} />
          </li>
        </ul>
      ) : (userData && !userData.isAdmin) || !userData ? (
        <ul className="flex space-x-4 lg:space-x-6 items-center justify-between">
          <li title="SEARCH">
            <SearchBar />
          </li>
          <li className="relative" title="CART">
            <Link to="/products/cart">
              <BsCart className="text-xl" />
            </Link>
            <span className="w-6 h-6 text-sm rounded-full bg-primary text-white absolute  top-[-10px] right-[-16px] flex items-center justify-center">
              {cartItems.reduce((a, c) => a + c.quantity, 0)}
            </span>
          </li>
          <li>
            <UserDropDown userData={userData} signoutHandler={signoutHandler} />
          </li>
        </ul>
      ) : null}
    </>
  );
};

export default UserMenu;
