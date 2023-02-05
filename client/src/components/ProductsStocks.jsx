import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MessageBox from "./MessageBox";

const ProductsStocks = ({ summary }) => {
  const products = [
    {
      title: "Face Cream",
      data: summary.availableFaceCream,
    },
    {
      title: "Lipstick",
      data: summary.availableLipstick,
    },
    {
      title: "Lotion",
      data: summary.availableLotion,
    },
    {
      title: "Powder",
      data: summary.availablePowder,
    },
  ];

  return (
    <div className="border rounded px-6 py-4">
      <h2 className="text-center">Products Stocks</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) =>
          product.data.length === 0 ? (
            <MessageBox danger key={product.title}>
              No {product.title} Available
            </MessageBox>
          ) : (
            <div key={product.title}>
              <h4>{product.title}</h4>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={product.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stocks" fill="#0d98ba" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductsStocks;
