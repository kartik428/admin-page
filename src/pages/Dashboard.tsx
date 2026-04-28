// Dashboard.tsx

import BackupCard from "../components/BackupCard";
import BannerForm from "../components/BannerForm";
import StatsCards from "../components/StatsCards";

export default function Dashboard() {
  
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BannerForm />
                <BackupCard />
            </div>
        </div>
    );
}