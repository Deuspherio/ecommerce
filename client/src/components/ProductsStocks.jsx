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
      <div>
        <h4>Electronics</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={summary.availableElectronics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stocks" fill="#0d98ba" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductsStocks;
