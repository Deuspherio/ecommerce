import { Link, useNavigate } from "react-router-dom";
import { BsCart, BsHeart } from "react-icons/bs";
import { useContext } from "react";
import SearchBar from "./SearchBar";
import { Store } from "../context";
import UserDropDown from "./UserDropDown";
import MenuDropDown from "./MenuDropDown";

const navItems = [
  {
    option: "Home",
    link: "/",
  },
  {
    option: "About",
    link: "/",
  },
  {
    option: "Contact",
    link: "/",
  },
  {
    option: "Stores",
    link: "/",
  },
];

const Header = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    user: { userData },
  } = state;
  const navigate = useNavigate();

  const signoutHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingData");
    navigate("/user/signin");
  };

  return (
    <div className="w-full shadow-md fixed top-0 right-0 left-0 z-[999] bg-white">
      <div className="w-full container px-6 py-4 mx-auto flex items-center justify-between relative z-20">
        <div className="hidden md:flex md:space-x-6">
          <button>EN</button>
          <button>PHP</button>
        </div>
        <Link to="/" title="Home">
          ecommerce
        </Link>
        <ul className="hidden lg:flex lg:space-x-6 lg:items-center">
          {navItems.map((item, i) => (
            <li key={i}>
              <Link to={item.link}>{item.option}</Link>
            </li>
          ))}
        </ul>
        <ul className="hidden lg:flex lg:space-x-6 lg:items-center lg:justify-between">
          <li>
            <SearchBar />
          </li>
          <li>
            <UserDropDown userData={userData} signoutHandler={signoutHandler} />
          </li>
          <li>
            <Link to="/">
              <BsHeart className="text-xl" />
            </Link>
          </li>
          <li className="relative">
            <Link to="/products/cart">
              <BsCart className="text-xl" />
            </Link>
            <span className="w-6 h-6 text-sm rounded-full bg-primary text-white absolute  top-[-10px] right-[-16px] flex items-center justify-center">
              {cartItems.reduce((a, c) => a + c.quantity, 0)}
            </span>
          </li>
        </ul>
        <ul className="flex space-x-4 text-xl items-center md:space-x-6 lg:hidden">
          <li>
            <SearchBar />
          </li>
          <li>
            <UserDropDown userData={userData} signoutHandler={signoutHandler} />
          </li>
          <li className="relative">
            <Link to="/products/cart">
              <BsCart className="text-xl" />
            </Link>
            <span className="w-6 h-6 text-sm rounded-full bg-primary text-white absolute top-[-10px] right-[-16px] flex items-center justify-center">
              {cartItems.reduce((a, c) => a + c.quantity, 0)}
            </span>
          </li>
          <li>
            <MenuDropDown navItems={navItems} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
