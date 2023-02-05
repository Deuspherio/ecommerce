import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { BsPerson } from "react-icons/bs";
import { Link } from "react-router-dom";

const adminOptions = [
  {
    option: "Overview",
    link: "/admin/dashboard",
  },
  {
    option: "Prediction Table",
    link: "/admin/prediction",
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
        <Link to="/user/signin">
          <BsPerson className="text-xl" />
        </Link>
      ) : (
        <Menu as="div" className="relative inline-block">
          <Menu.Button className="inline-flex w-full justify-center focus:outline-none">
            <BsPerson className="text-xl" />
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
              <div className="px-1 py-1">
                {userData.isAdmin ? (
                  <>
                    <Menu.Item>
                      <Menu as="div" className="relative inline-block w-full">
                        <Menu.Button className="inline-flex w-full items-center rounded px-2 py-2 transition-bg text-base hover:bg-primary hover:text-white focus:outline-none">
                          Dashboard
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
                          <Menu.Items className="absolute right-20 mt-2 w-44 text-center origin-top-right divide-y divide-gray-100 rounded bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none md:right-32">
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
                                      } group flex w-full items-center rounded px-2 py-2 text-base`}
                                    >
                                      {admin.option}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </Menu.Item>
                    {/* {adminOptions.map((admin, i) => (
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
                    ))} */}
                  </>
                ) : null}
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
