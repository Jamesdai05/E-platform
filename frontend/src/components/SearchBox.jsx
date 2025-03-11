import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const SearchBox = () => {
  const {keyword:urlKeyword}=useParams();
  const [search,setSearch]=useState(urlKeyword || "");
  const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log("submit");
  }


  return (
    <div>
      <Form onSubmit={handleSubmit} className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search product"
          className="me-2"
          aria-label="Search"
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </Form>
    </div>
  );
}
export default SearchBox