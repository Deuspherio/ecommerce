import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div className="grid gap-4 grid-cols-2 mb-6 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 h-[500px]">
      <Link
        to="/?category=all"
        className="border rounded transition-shadow hover:shadow-md lg:row-span-2"
      >
        All
      </Link>
      <Link
        to="/?category=face-cream"
        className="border rounded transition-shadow hover:shadow-md lg:col-span-2"
      >
        Face Cream
      </Link>
      <Link
        to="/?category=lipstick"
        className="border rounded transition-shadow hover:shadow-md"
      >
        Lipstick
      </Link>
      <Link
        to="/?category=lotion"
        className="border rounded transition-shadow hover:shadow-md"
      >
        Lotion
      </Link>
      <Link
        to="/?category=powder"
        className="border rounded transition-shadow hover:shadow-md lg:col-span-2"
      >
        Powder
      </Link>
    </div>
  );
};

export default Category;
