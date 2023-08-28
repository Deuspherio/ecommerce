import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../context";
import UserMenu from "./UserMenu";

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
    <header className="w-full shadow-md fixed top-0 right-0 left-0 z-[999] backdrop-blur">
      <nav className="w-full container px-6 py-4 mx-auto flex items-center justify-between relative z-20">
        <Link to="/" title="Home" className="font-logo text-lg md:text-2xl">
          bayesian-ecommerce
        </Link>
        {(userData && !userData.isAdmin) || !userData ? (
          <ul className="hidden lg:flex lg:space-x-6 lg:items-center">
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
        <div className="hidden lg:block">
          <UserMenu
            userData={userData}
            signoutHandler={signoutHandler}
            cartItems={cartItems}
          />
        </div>
        <div className="lg:hidden">
          <UserMenu
            userData={userData}
            signoutHandler={signoutHandler}
            cartItems={cartItems}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
