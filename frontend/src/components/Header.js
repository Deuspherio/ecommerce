import React, { useContext, useState } from "react";
import { Badge, Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { Store } from "../store";
import Cart from "./Cart";
import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { adminData, customerData } from "./SidebarData";
import { VscSignOut } from "react-icons/vsc";
import { IoIosMenu } from "react-icons/io";
import SearchBar from "./SearchBar";

function Header({ openCart, setOpenCart, openMenu, setOpenMenu }) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart,
    user: { userData },
  } = state;

  const signoutHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("shippingAddress");
    setOpenMenu(false);
    setOpenCart(false);
    window.location.replace("/signin");
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Navbar
        collapseOnSelect
        expanded={expanded}
        bg="light"
        variant="light"
        expand="lg"
        fixed="top"
      >
        <Container className={userData ? "adjusted-container" : ""}>
          {userData ? (
            <div className="sm-menu">
              <Button
                className="d-flex align-items-center justify-content-center"
                type="button"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <IoIosMenu />
              </Button>
            </div>
          ) : null}
          <LinkContainer to="/" title="HOME">
            <Navbar.Brand>ecommerce</Navbar.Brand>
          </LinkContainer>
          {(openCart || openMenu) && (
            <div
              className={openCart || openMenu ? "cover active-cover" : "cover"}
              onClick={() => {
                openMenu && setOpenMenu(!openMenu);
                openCart && setOpenCart(!openCart);
              }}
            ></div>
          )}
          <div className="search-md">
            <SearchBar />
          </div>
          <Navbar.Toggle
            onClick={() => setExpanded(expanded ? false : "expanded")}
            className="menu-toggle"
            aria-controls="navbar-nav"
          >
            <IoIosMenu />
            {cart.cartItems.length > 0 && (
              <Badge pill bg="danger">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </Badge>
            )}
          </Navbar.Toggle>
          <Navbar.Collapse id="navbar-nav">
            <Nav className="w-100 me-auto align-items-center justify-content-end nav-menu gap-3">
              <div className="search-lg">
                <SearchBar />
              </div>
              <div className="d-flex align-items-center justify-content-center">
                {userData && (
                  <Button
                    type="button"
                    className="user-btn"
                    onClick={() => {
                      setOpenMenu(!openMenu);
                      setExpanded(false);
                    }}
                  >
                    {`${userData.firstName} ${userData.lastName}`}
                  </Button>
                )}
                {!userData && (
                  <div className="d-flex  align-items-center justify-content-center sign">
                    <Link to="/signin" onClick={() => setExpanded(false)}>
                      Sign In
                    </Link>
                    <div to="/signup" className="signup">
                      <Button
                        type="button"
                        onClick={() => {
                          navigate("/signup");
                          setExpanded(false);
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex align-items-center  justify-content-center nav-btn">
                <Button
                  type="button"
                  onClick={() => {
                    setOpenCart(!openCart);
                    setExpanded(false);
                  }}
                >
                  <FaShoppingCart />
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </Nav>
          </Navbar.Collapse>
          {userData && (
            <>
              <Nav
                className={
                  openMenu
                    ? "active-sidebar-menu sidebar-menu flex-column position-fixed top-0 end-0"
                    : "sidebar-menu flex-column position-fixed top-0"
                }
              >
                <div className="close d-flex justify-content-end">
                  <Button type="button" onClick={() => setOpenMenu(!openMenu)}>
                    <AiOutlineClose />
                  </Button>
                </div>
                <Link
                  to="/"
                  className={
                    window.location.pathname === "/" ? "active-menu" : ""
                  }
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <AiOutlineHome />
                  Home
                </Link>
                {userData && userData.isAdmin && (
                  <>
                    <hr />
                    {adminData.map((admin) => (
                      <Link
                        key={admin.title}
                        to={admin.link}
                        className={
                          window.location.pathname === admin.link
                            ? "active-menu"
                            : ""
                        }
                        onClick={() => setOpenMenu(!openMenu)}
                      >
                        {admin.icon}
                        {admin.title}
                      </Link>
                    ))}
                  </>
                )}
                {userData && (
                  <>
                    <hr />
                    {customerData.map((user) => (
                      <Link
                        key={user.title}
                        to={user.link}
                        className={
                          window.location.pathname === user.link
                            ? "active-menu"
                            : ""
                        }
                        onClick={() => setOpenMenu(!openMenu)}
                      >
                        {user.icon}
                        {user.title}
                      </Link>
                    ))}
                  </>
                )}
                {userData && (
                  <>
                    <hr />
                    <Link to="#signout" onClick={signoutHandler}>
                      <VscSignOut />
                      Sign Out
                    </Link>
                  </>
                )}
              </Nav>
              <Nav className="sidebar-icons position-fixed top-0 start-0 flex-column">
                <div className="menu d-flex align-items-center">
                  <Button type="button" onClick={() => setOpenMenu(!openMenu)}>
                    <IoIosMenu />
                  </Button>
                </div>
                <Link
                  to="/"
                  className={
                    window.location.pathname === "/" ? "active-menu" : ""
                  }
                  title="Home"
                >
                  <AiOutlineHome />
                </Link>
                {userData && userData.isAdmin && (
                  <>
                    <hr />
                    {adminData.map((admin) => (
                      <Link
                        title={admin.title}
                        key={admin.title}
                        to={admin.link}
                        className={
                          window.location.pathname === admin.link
                            ? "active-menu"
                            : ""
                        }
                      >
                        {admin.icon}
                      </Link>
                    ))}
                  </>
                )}
                {userData && (
                  <>
                    <hr />
                    {customerData.map((user) => (
                      <Link
                        title={user.title}
                        key={user.title}
                        to={user.link}
                        className={
                          window.location.pathname === user.link
                            ? "active-menu"
                            : ""
                        }
                      >
                        {user.icon}
                      </Link>
                    ))}
                  </>
                )}
                {userData && (
                  <>
                    <hr />
                    <Link to="#signout" onClick={signoutHandler}>
                      <VscSignOut />
                    </Link>
                  </>
                )}
              </Nav>
            </>
          )}
        </Container>
      </Navbar>
      <div
        className={
          openCart
            ? "active-sidebar-cart sidebar-cart position-fixed top-0 end-0"
            : "sidebar-cart position-fixed top-0"
        }
      >
        <Cart openCart={openCart} setOpenCart={setOpenCart} />
      </div>
    </>
  );
}

export default Header;
