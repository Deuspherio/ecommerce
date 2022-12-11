import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(name ? `/search?name=${name}` : "/search");
  };

  return (
    <Form className="d-flex me-auto search" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="searchName"
          id="searchName"
          onChange={(e) => setName(e.target.value)}
          placeholder="Search Product's Name..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button outline="primary" type="submit" id="button-search">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;
