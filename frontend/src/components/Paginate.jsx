import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";


const Paginate = ({pages,page,isAdmin=false}) => {
  // to set the admin for the prodctlist for future development.
  return (
    {pages}>1 && (
    <Pagination>
      {[...Array(pages).keys()].map(p=>(
        <Link
        key={p+1} to={!isAdmin ? `/page/${p+1}` : `admin/productlist/${p+1}` }>

          <Pagination.Item active={p+1===page}>{p+1}</Pagination.Item>
        </Link>
      ))}

    </Pagination>)
  )
}
export default Paginate;