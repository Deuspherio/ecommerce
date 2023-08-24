import React from "react";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ContactPage = () => {
  return (
    <div className="custom-container flex">
      <div className="flex-grow flex-shrink basis-1/2">
        <img
          src="https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
          alt="unsplash"
          className="h-full rounded max-h-[580px]"
        />
      </div>
      <div className="flex-grow flex-shrink basis-1/2">
        <h1 className="text-6xl mb-8">Contact Us</h1>
        <div className="flex gap-8 items-center flex-col">
          <div className="flex items-center flex-col">
            <FaUserCircle className="text-8xl" />
            <h4 className="mb-0">Lorem ipsum dolor sit.</h4>
            <p className="font-bold">ECommerce Owner</p>
            <div className="flex gap-4">
              <Link to="/">
                <BsFacebook className="text-xl transition-color hover:text-primary" />
              </Link>
              <Link to="/">
                <BsTwitter className="text-xl transition-color hover:text-primary" />
              </Link>
              <Link to="/">
                <BsLinkedin className="text-xl transition-color hover:text-primary" />
              </Link>
              <Link to="/">
                <BsInstagram className="text-xl transition-color hover:text-primary" />
              </Link>
            </div>
          </div>
          <p className="text-justify">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam optio
            ab alias natus sed fugit velit tempore minus veniam exercitationem
            iure, at aliquid impedit corrupti. Eligendi aliquid voluptates illo.
            Explicabo commodi in soluta sapiente rem, recusandae at praesentium
            minus expedita repellat dolorum harum accusamus obcaecati quo
            reprehenderit. Deleniti, quia adipisci?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
