import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define types for chart data
interface MonthlyAttendance {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export default function MonthlyReport() {
  const [barChartData, setBarChartData] = useState<any>(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/attendance/monthly"
        );
        const data: MonthlyAttendance[] = await response.json();

        const labels = data.map((entry) => entry.month);
        const presentData = data.map((entry) => entry.present);
        const absentData = data.map((entry) => entry.absent);
        const lateData = data.map((entry) => entry.late);

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Present",
              data: presentData,
              backgroundColor: "#1ea3f6",
            },
            {
              label: "Absent",
              data: absentData,
              backgroundColor: "#ff4d4d",
            },
            {
              label: "Late",
              data: lateData,
              backgroundColor: "#ffc107",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchBarChartData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Report</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          {barChartData ? (
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
