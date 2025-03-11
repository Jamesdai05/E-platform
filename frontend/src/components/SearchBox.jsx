import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const SearchBox = () => {
  const {keyword:urlKeyword}=useParams();
  const [search,setSearch]=useState(urlKeyword || "");
  const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
    // console.log("submit");
    if(search.trim()){
      navigate(`/search/${search}`)
    }
  }


  return (
    <Form onSubmit={handleSubmit} className="d-flex me-auto">
      <Form.Control
        type="search"
        placeholder="Search product"
        className="me-2"
        aria-label="Search"
        value={search}
        onChange={e=>setSearch(e.target.value)}
      />
      <Button type="submit" className="p-2 mx-2" variant="outline-secondary" >Search</Button>
    </Form>
  );
}
export default SearchBox