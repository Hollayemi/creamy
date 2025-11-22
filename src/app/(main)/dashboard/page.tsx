import { ChartAreaInteractive } from "./_components/dashboard/chart-area-interactive";
import { DataTable } from "./_components/dashboard/data-table";
import data from "./_components/dashboard/data.json";
import { SectionCards } from "./_components/dashboard/section-cards";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </div>
  );
}
