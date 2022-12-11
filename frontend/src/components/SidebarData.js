import { AiOutlineHistory } from "react-icons/ai";
import { FiShoppingBag, FiUsers } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { IoBagOutline } from "react-icons/io5";

export const allUser = [
  {
    title: "Home",
    icon: <FaHome />,
    link: "/",
  },
];

export const adminData = [
  {
    title: "Dashboard",
    icon: <MdOutlineSpaceDashboard />,
    link: "/admin/dashboard",
  },
  {
    title: "List of Orders",
    icon: <FiShoppingBag />,
    link: "/admin/orders-list",
  },
  {
    title: "List of Products",
    icon: <IoBagOutline />,
    link: "/admin/products-list",
  },
  {
    title: "List of Users",
    icon: <FiUsers />,
    link: "/admin/users-list",
  },
];

export const customerData = [
  {
    title: "Update Profile",
    icon: <VscAccount />,
    link: "/update-profile",
  },
  {
    title: "Orders History",
    icon: <AiOutlineHistory />,
    link: "/order-history",
  },
];
