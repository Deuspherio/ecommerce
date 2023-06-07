import { Link } from "react-router-dom";
import { BsDiscord, BsFacebook, BsLinkedin, BsTwitter } from "react-icons/bs";

const categoriesItems = [{ name: "Electronics", to: "/" }];
const linksItems = [
  { name: "FAQ", to: "/" },
  { name: "Pages", to: "/" },
  { name: "Stores", to: "/" },
  { name: "Cookies", to: "/" },
];

const Footer = () => {
  return (
    <div className="container mx-auto px-6 py-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-4">
          <h4 className="font-bold">Categories</h4>
          <ul className="flex flex-col space-y-2">
            {categoriesItems.map((item) => (
              <li key={item.name}>
                <Link to={item.to} className="text-sm">
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
                <Link to={item.to} className="text-sm">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 col-span-2 md:col-span-1">
          <h4 className="font-bold">About</h4>
          <p className="text-sm text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae fuga
            sit eaque voluptate dolorem autem inventore animi tempore illo
            cupiditate similique accusantium culpa aliquam, vero iste, earum
            sapiente accusamus voluptatum.
          </p>
        </div>
        <div className="space-y-4 col-span-2 md:col-span-3 lg:col-span-1">
          <h4 className="font-bold">Contact</h4>
          <p className="text-sm text-justify">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab fugit
            accusamus dolorem iure officiis aut vel expedita facere sequi
            tempore! Commodi quisquam culpa ad quo suscipit explicabo at
            asperiores ipsam totam alias, exercitationem nemo temporibus facilis
            fuga inventore beatae rerum?
          </p>
        </div>
      </div>
      <div className="flex items-center flex-col flex-wrap justify-center space-y-4 mt-8 md:flex-row md:justify-between">
        <Link to="/">ecommerce</Link>
        <div className="md:order-3 flex gap-4">
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
            <BsDiscord className="text-xl transition-color hover:text-primary" />
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
