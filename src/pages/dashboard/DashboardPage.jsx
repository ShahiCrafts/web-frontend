import DashboardCard from "../../components/admin/overview/AnalyticsCard";
import HeatMapCard from "../../components/admin/overview/HeatMapCard";
import RevenueCard from "../../components/admin/overview/RevenueCard";
import StatisticsCard from "../../components/admin/overview/StatisticsCard";
import UserAccounts from "../../components/admin/overview/UsersTable";


export default function DashboardPage() {
  return (
    <>
      {/* Top Cards: Left & Right Side-by-Side */}
      <div className="flex flex-col xl:flex-row gap-3 items-start">
        {/* Left Side */}
        <div className="w-full xl:w-2/3 flex flex-col gap-3">
          <DashboardCard />
          <StatisticsCard />
        </div>

        {/* Right Side */}
        <div className="w-full xl:w-1/3 flex flex-col gap-3">
          <RevenueCard />
          <HeatMapCard />
        </div>
      </div>

      {/* Full Width UserAccounts Section */}
      <div className="mt-3 w-full">
        <UserAccounts />
      </div>
    </>
  );
}
