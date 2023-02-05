import { useEffect, useMemo, useState } from "react";
import { roundToTwo } from "../utilities";
import {} from "react-table";
import { useTable } from "react-table/dist/react-table.development";

const COLUMNS = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Product Name",
    accessor: "name",
  },
];

const ProductsList = ({ products }) => {
  const [data, setData] = useState([]);
  const columns = useMemo(() => COLUMNS, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  console.log(products);
  useEffect(() => {
    setData(products);
  }, [products]);
  return (
    <div className="container-lg">
      <div className="overflow-x-auto relative rounded border px-6 py-4">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <table className="w-full text-left text-gray-500 dark:text-gray-400">
          <thead className="text-lg w-full text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6" rowSpan={2}>
                PRODUCT NAME
              </th>
              <th scope="col" className="py-3 px-6" rowSpan={2}>
                SALES
              </th>
              <th scope="col" className="py-3 px-6 text-center" colSpan={3}>
                PRICE
              </th>
              <th scope="col" className="py-3 px-6 text-center" colSpan={2}>
                DISCOUNT
              </th>
            </tr>
            <tr>
              <th className="py-3 px-6">ORIGINAL</th>
              <th className="py-3 px-6">CURRENT</th>
              <th className="py-3 px-6">PREDICTION</th>
              <th className="py-3 px-6">CURRENT</th>
              <th className="py-3 px-6">FUTURE</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                className="bg-white border-b dark:bg-gray-w-full 800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={product._id}
              >
                {product.stocks > 0 && (
                  <>
                    <th className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {product.name}
                    </th>
                    <td className="py-4 px-6">{`₱ ${roundToTwo(
                      product.discountedPrice * product.soldItems
                    ).toLocaleString()}`}</td>
                    <td className="py-4 px-6">{`₱ ${product.price.toLocaleString()}`}</td>
                    <td className="py-4 px-6">{`₱ ${product.discountedPrice.toLocaleString()}`}</td>
                    <td className="py-4 px-6">{`₱ ${product.pricePrediction.toLocaleString()}`}</td>
                    <td className="py-4 px-6">{`${roundToTwo(
                      (100 * (product.price - product.discountedPrice)) /
                        product.price
                    )}%`}</td>
                    <td className="py-4 px-6">{`${roundToTwo(
                      (100 * (product.price - product.pricePrediction)) /
                        product.price
                    )}%`}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default ProductsList;
