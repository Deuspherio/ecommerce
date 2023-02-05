import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { BsList } from "react-icons/bs";
import { Link } from "react-router-dom";

const MenuDropDown = ({ navItems }) => {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button className="inline-flex w-full justify-center focus:outline-none">
        <BsList className="text-xl" />
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
            <div className="px-1 py-1">
              {navItems.map((item, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <Link
                      to={item.link}
                      className={`${
                        active
                          ? "bg-primary text-white transition-bg"
                          : "text-gray-900 transition-bg"
                      } group flex w-full items-center rounded px-2 py-2 text-base`}
                    >
                      {item.option}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuDropDown;
