import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/products/search?query=${query}` : "/products/search");
  };
  return (
    <form
      className="flex items-center border rounded-sm bg-white"
      onSubmit={submitHandler}
    >
      <input
        name="search"
        id="search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-16 h-8 p-2 text-sm transition-width ease-in-out duration-150 rounded focus:w-20 focus:outline-none md:w-32 md:focus:w-40"
      />
      <button type="submit" className="p-2">
        <BsSearch className="text-xl" />
      </button>
    </form>
  );
};

export default SearchBar;
