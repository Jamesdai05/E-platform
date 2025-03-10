import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";


const Paginate = ({pages,page,isAdmin=false}) => {
  // to set the admin for the prodctlist for future development.
  return (
    pages>1 && (
    <Pagination className="justify-content-center my-4" size="sm">
      {[...Array(pages).keys()].map(p=>(

          <Pagination.Item as={Link}
          key={p+1}
          to={!isAdmin ? `/page/${p+1}` : `admin/productlist/${p+1}` }
          active={p+1===page}
          aria-label={`go to page ${p+1}`}
          >{p+1}</Pagination.Item>
      ))}
    </Pagination>)
  )
}
export default Paginate;