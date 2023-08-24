import { Link, useNavigate } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { useContext } from "react";
import SearchBar from "./SearchBar";
import { Store } from "../context";
import UserDropDown from "./UserDropDown";

const navItems = [
  {
    option: "Home",
    link: "/",
  },
  {
    option: "About Us",
    link: "/about",
  },
  {
    option: "Contact Us",
    link: "/contact",
  },
  {
    option: "FAQ",
    link: "/faq",
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
    <div className="w-full shadow-md fixed top-0 right-0 left-0 z-[999] backdrop-blur">
      <div className="w-full container px-6 py-4 mx-auto flex items-center justify-between relative z-20">
        <Link to="/" title="Home" className="font-logo text-2xl">
          bayesian-ecommerce
        </Link>
        {(userData && !userData.isAdmin) || !userData ? (
          <ul className="flex space-x-6 items-center">
            {navItems.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.link}
                  className="transition-color hover:text-primary"
                >
                  {item.option}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {userData && userData.isAdmin ? (
          <ul className="flex space-x-6 items-center justify-between">
            <li>
              <UserDropDown
                userData={userData}
                signoutHandler={signoutHandler}
              />
            </li>
          </ul>
        ) : null}
        {(userData && !userData.isAdmin) || !userData ? (
          <ul className="flex space-x-6 items-center justify-between">
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
              <UserDropDown
                userData={userData}
                signoutHandler={signoutHandler}
              />
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
