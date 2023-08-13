import { useQuery } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { getUsers } from "./users.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";

const PAGE_SIZE = 10;
const UsersListPage = () => {
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);
  const {
    data: users,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery(["users"], () => getUsers(userData));
  const [currentPage, setCurrentPage] = useState(1);
  const lastProductIndex = currentPage * PAGE_SIZE;
  const firstProductIndex = lastProductIndex - PAGE_SIZE;
  return (
    <>
      <Helmet>
        <title>List of Users</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : isSuccess ? (
        <div className="custom-container">
          <h1 className="text-center">List of Users</h1>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full uppercase">
                <tr>
                  <th scope="col">FIRST NAME</th>
                  <th scope="col">LAST NAME</th>
                  <th scope="col">EMAIL</th>
                  <th scope="col">PHONE NUMBER</th>
                  <th scope="col">ADDRESS</th>
                  <th scope="col">ADMIN</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(firstProductIndex, lastProductIndex)
                  .map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.address}</td>
                      <td>{user.isAdmin ? "Yes" : "No"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Pagination
            items={users}
            PAGE_SIZE={PAGE_SIZE}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : null}
    </>
  );
};

export default UsersListPage;
