import React from "react";

const AboutPage = () => {
  return (
    <div className="custom-container flex flex-col md:flex-row gap-4 lg:gap-6">
      <div className="md:flex-grow md:flex-shrink md:basis-1/2">
        <h1 className="md:hidden text-center text-4xl mb-4">About Us</h1>
        <img
          src="https://images.unsplash.com/photo-1593238350103-81a14cce9c54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
          alt="unsplash"
          className="h-full rounded max-h-[580px]"
        />
      </div>
      <div className="md:flex-grow md:flex-shrink md:basis-1/2">
        <h1 className="hidden md:block text-center text-4xl lg:text-6xl mb-4 md:mb-8">
          About Us
        </h1>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <h4 className="text-center md:text-left flex-grow flex-shrink basis-1/4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima,
            molestias?
          </h4>
          <p className="flex-grow flex-shrink basis-3/4 text-justify">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi odio
            excepturi ipsum cumque modi facere suscipit a ipsa voluptate fugit
            itaque mollitia neque quas provident reiciendis quidem, id dolor
            laboriosam molestiae? Unde consequatur praesentium temporibus ex,
            officiis ullam iusto magnam ipsa quas repellendus dignissimos
            assumenda. Non, enim voluptates eius quia illum beatae incidunt,
            alias fugit repellendus in amet quos harum perferendis
            necessitatibus, dolorem aliquam suscipit rem neque ducimus rerum?
            Aperiam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
