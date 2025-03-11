import { Table, Button,} from "react-bootstrap";
import { FaTimes, FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import { useDeleteUserMutation, useGetUsersQuery } from "../../slices/usersApiSlice.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Userlist = () => {

  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  // console.log(users)


  const [deleteUser, {isLoading: loadingDelete}] =useDeleteUserMutation();

  const handleDelete=async(id)=>{
    // console.log("handle Deleting")
    if(window.confirm("Are you sure want to delete the user?")){
      try {
        await deleteUser(id);
        refetch();
        toast.success("User is deleted!", { position: "top-center" });
      } catch (error) {
        toast.error(error?.data?.message || error?.error, {
          position: "top-center",
        });
      }
    }
  }

  return (
    <>
      <h1>Userlist</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data.message || error?.error}
        </Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS_ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user && user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <Link to={`/admin/user/${user._id}/edit`}>
                    <Button variant="primary" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </Link>
                  <Button variant="danger" className="btn-sm mx-2" onClick={()=>handleDelete(user._id)}>
                    <FaTrash style={{color:"white"}}/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
export default Userlist;