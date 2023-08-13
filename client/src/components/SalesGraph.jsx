import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SalesGraph = ({ summary }) => {
  return (
    <div className="flex space-x-4">
      <div className="border rounded px-6 py-4 w-2/4">
        <h2 className="text-center">Daily Sales</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={summary.dailySales}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d98ba" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0d98ba" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#8884d8" strokeDasharray="5 5" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              formatter={(value) => new Intl.NumberFormat("en").format(value)}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#0d98ba"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="border rounded px-6 py-4 w-2/4">
        <h2 className="text-center">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={summary.monthlySales}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d98ba" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0d98ba" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#8884d8" strokeDasharray="5 5" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              formatter={(value) => new Intl.NumberFormat("en").format(value)}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#0d98ba"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesGraph;
