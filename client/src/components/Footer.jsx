import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

const categoriesItems = [
  {
    name: "Gadgets",
    to: "/products/search?page=1&query=all&category=gadgets&price=all&rating=all&order=newest",
  },
  {
    name: "Accessories",
    to: "/products/search?page=1&query=all&category=accessories&price=all&rating=all&order=newest",
  },
  {
    name: "Appliances",
    to: "/products/search?page=1&query=all&category=appliances&price=all&rating=all&order=newest",
  },
];
const linksItems = [
  { name: "Home", to: "/" },
  { name: "About Us", to: "/about" },
  { name: "Contact Us", to: "/contact" },
  { name: "FAQ", to: "/faq" },
];

const Footer = () => {
  return (
    <div className="container mx-auto px-6 py-4">
      <div className="grid gap-4 grid-cols-4">
        <div className="space-y-4">
          <h4 className="font-bold">Categories</h4>
          <ul className="flex flex-col space-y-2">
            {categoriesItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className="text-sm transition-color hover:text-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold">Links</h4>
          <ul className="flex flex-col space-y-2">
            {linksItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className="text-sm transition-color hover:text-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 col-span-1" id="about">
          <h4 className="font-bold">About Us</h4>
          <p className="text-sm text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae fuga
            sit eaque voluptate dolorem autem inventore animi tempore illo
            cupiditate similique accusantium culpa aliquam, vero iste, earum
            sapiente accusamus voluptatum.
          </p>
          <div className="flex justify-end items-center">
            <Link to="/about" className="btn-primary w-auto text-sm">
              Read more...
            </Link>
          </div>
        </div>
        <div className="space-y-4 col-span-1" id="contact">
          <h4 className="font-bold">Contact Us</h4>
          <p className="text-sm text-justify">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab fugit
            accusamus dolorem iure officiis aut vel expedita facere sequi
            tempore! Commodi quisquam culpa ad quo suscipit explicabo at
            asperiores ipsam totam alias, exercitationem nemo temporibus facilis
            fuga inventore beatae rerum?
          </p>
          <div className="flex justify-end items-center">
            <Link to="/contact" className="btn-primary w-auto text-sm">
              Read more...
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-center space-y-4 mt-8 flex-row md:justify-between">
        <Link to="/" title="Home" className="font-logo text-2xl">
          bayesian-ecommerce
        </Link>
        <div className="order-3 flex gap-4">
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
        <p className="text-xs md:order-2">
          © Copyright 2023. All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
