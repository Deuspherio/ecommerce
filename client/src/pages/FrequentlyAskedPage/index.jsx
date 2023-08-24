import { Disclosure } from "@headlessui/react";
import React from "react";
import { BsChevronUp } from "react-icons/bs";

const FrequentlyAskedPage = () => {
  return (
    <div className="custom-container flex">
      <div className="flex-grow flex-shrink basis-1/2">
        <img
          src="https://images.unsplash.com/photo-1516246843873-9d12356b6fab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=435&q=80"
          alt="unsplash"
          className="h-full rounded max-h-[580px]"
        />
      </div>
      <div className="flex-grow flex-shrink basis-1/2">
        <h1 className="text-6xl mb-8">Frequently Asked Questions</h1>
        <div className="w-full px-4 pt-16">
          <div className="mx-auto w-full max-w-md rounded bg-white p-2">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full border-b transition-shadow hover:shadow-md rounded justify-between bg-primary-100 px-4 py-2 text-left hover:text-primary font-bold focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                    <span>Lorem ipsum dolor sit.</span>
                    <BsChevronUp
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Corporis cupiditate illo sapiente eligendi corrupti qui esse
                    itaque. Corporis, vel? Omnis.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full border-b transition-shadow hover:shadow-md rounded justify-between bg-primary-100 px-4 py-2 text-left hover:text-primary font-bold focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                    <span>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </span>
                    <BsChevronUp
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    Lorem.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full border-b transition-shadow hover:shadow-md rounded justify-between bg-primary-100 px-4 py-2 text-left hover:text-primary font-bold focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                    <span>Lorem, ipsum.</span>
                    <BsChevronUp
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Atque sint facilis illum odio explicabo sapiente.
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full border-b transition-shadow hover:shadow-md rounded justify-between bg-primary-100 px-4 py-2 text-left hover:text-primary font-bold focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                    <span>
                      Lorem ipsum, dolor sit amet consectetur adipisicing.
                    </span>
                    <BsChevronUp
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Nisi, doloribus!
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAskedPage;
