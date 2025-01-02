import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PlusCircleIcon,
  EyeSlashIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";
import { Home, AddExpenses, Overview, Report } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <PlusCircleIcon {...icon} />,
        name: "Add Expense",
        path: "/addexpenses",
        element: <AddExpenses />,
      },
      {
        icon: <EyeSlashIcon {...icon} />,
        name: "Overview",
        path: "/overview",
        element: <Overview />,
      },
      // {
      //   icon: <DocumentTextIcon {...icon} />,
      //   name: "Report",
      //   path: "/report",
      //   element: <Report />,
      // },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
