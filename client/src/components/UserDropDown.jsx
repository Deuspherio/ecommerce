import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

const adminOptions = [
  {
    option: "Dashboard",
    link: "/admin/dashboard",
  },
  {
    option: "List of Products",
    link: "/admin/products",
  },
  {
    option: "List of Orders",
    link: "/admin/orders",
  },
  {
    option: "List of Users",
    link: "/admin/users",
  },
  {
    option: "Update Profile",
    link: "/user/profile",
  },
];

const userOptions = [
  {
    option: "Update Profile",
    link: "/user/profile",
  },
  {
    option: "Order History",
    link: "/user/order/history",
  },
];

const UserDropDown = ({ userData, signoutHandler }) => {
  return (
    <>
      {!userData ? (
        <div className="flex space-x-6">
          <Link to="/user/signin">SignIn</Link>
          <Link to="/user/signup">SignUp</Link>
        </div>
      ) : (
        <Menu as="div" className="relative inline-block">
          <Menu.Button
            className="inline-flex w-full justify-center focus:outline-none"
            title="MENU"
          >
            <AiOutlineMenu className="text-xl" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-44 text-center origin-top-right divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                {userData ? (
                  <Menu.Item>
                    <div className="group w-full rounded px-2 py-2">
                      <p className="text-sm font-bold text-start">
                        Signed in as:
                      </p>
                      <p className="ml-5 text-base">{`${
                        userData.firstName
                      } ${userData.lastName.slice(0, 1)}.`}</p>
                    </div>
                  </Menu.Item>
                ) : null}
              </div>
              {userData.isAdmin ? (
                <div className="px-1 py-1">
                  {adminOptions.map((admin, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <Link
                          to={admin.link}
                          className={`${
                            active
                              ? "bg-primary text-white transition-bg"
                              : "text-gray-900 transition-bg"
                          } group flex w-full items-center rounded px-2 py-2`}
                        >
                          {admin.option}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              ) : null}
              {!userData.isAdmin ? (
                <div className="px-1 py-1">
                  {userOptions.map((user, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <Link
                          to={user.link}
                          className={`${
                            active
                              ? "bg-primary text-white transition-bg"
                              : "text-gray-900 transition-bg"
                          } group flex w-full items-center rounded px-2 py-2 text-base`}
                        >
                          {user.option}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              ) : null}
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active
                          ? "bg-primary text-white transition-bg"
                          : "text-gray-900 transition-bg"
                      } group flex w-full items-center rounded px-2 py-2 text-base`}
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </>
  );
};

export default UserDropDown;
