import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";


const Paginate = ({pages,page,isAdmin=false,keyword="",query=""}) => {
  // to set the admin for the prodctlist for future development.
  // query keeps the active filter, e.g. minPrice=10&maxPrice=50, on every page link
  const search = query ? `?${query}` : "";

  return (
    pages>1 && (
    <Pagination className="justify-content-center my-4" size="sm">
      {[...Array(pages).keys()].map(p=>(

          <Pagination.Item as={Link}
          key={p+1}
          to={`${!isAdmin ? keyword ? `/search/${encodeURIComponent(keyword)}/page/${p+1}` : `/page/${p+1}` : `/admin/productlist/${p+1}`}${search}`}
          active={p+1===page}
          aria-label={`go to page ${p+1}`}
          >{p+1}</Pagination.Item>
      ))}
    </Pagination>)
  )
}
export default Paginate;