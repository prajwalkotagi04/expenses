import React, { useEffect, useState } from "react";
import { Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { BanknotesIcon, ChartBarIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/solid";
import { StatisticsChart } from "@/widgets/charts";


// Create a reusable StatisticsCard component
const StatisticsCard = ({ color, icon1, title, value, footer }) => {
  return (
    <div class="bg-white shadow rounded-lg p-4 flex flex-col items-start h-36">
      <div class="flex items-center mb-2">
        <div class="bg-gray-200 p-2 rounded">
          {icon1}
        </div>
        <div class="justify-end">
          <span class="ml-2 text-gray-600">{title}</span>

        </div>
      </div>
      <h2 class="text-3xl font-bold mb-1">₹{value}</h2>

      {/* <p className="text-green-500">+55% than last week</p> */}
    </div>

  );
};

export function Home() {
  const [dashboardData, setDashboardData] = useState({
    todayExpenses: 0,
    yesterdayExpenses: 0,
    monthExpenses: 0,
    yearExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();

        // Ensure we get the data or fallback to defaults if missing
        const { todayexpenses, yesterdayexpenses, monthexpenses, yearexpenses } = data.data || {};

        setDashboardData({
          todayExpenses: todayexpenses || 0,
          yesterdayExpenses: yesterdayexpenses || 0,
          monthExpenses: monthexpenses || 0,
          yearExpenses: yearexpenses || 0,
        });
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } catch (error) {
      setError("Error fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statisticsCardsData = [
    {
      color: "blue",
      title: "Today Expenses",
      icon1: BanknotesIcon,
      value: `${dashboardData.todayExpenses}`,
      footer: {
        color: "text-green-500",
        value: "Updated Now",
        label: "",
      },
    },
    {
      color: "purple",
      title: "Yesterday Expenses",
      icon1: UsersIcon,
      value: `${dashboardData.yesterdayExpenses}`,
      footer: {
        color: "text-green-500",
        value: "Updated Now",
        label: "",
      },
    },
    {
      color: "green",
      title: "Month Expenses",
      icon1: UserPlusIcon,
      value: `${dashboardData.monthExpenses}`,
      footer: {
        color: "text-green-500",
        value: "Updated Now",
        label: "",
      },
    },
    {
      color: "red",
      title: "Year Expenses",
      icon1: ChartBarIcon,
      value: `${dashboardData.yearExpenses}`,
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
  ];

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="mt-12">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          {statisticsCardsData.map(({ icon1, title, footer, ...rest }) => (
            <StatisticsCard
              key={title}
              {...rest}
              title={title}
              // icon={React.createElement(icon, {
              //   className: "w-6 h-6 text-white",
              // })}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>
                  &nbsp;{footer.label}
                </Typography>
              }
            />
          ))}
        </div>
      </div>
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
         {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
             footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}

    </>
  );
}

export default Home;
