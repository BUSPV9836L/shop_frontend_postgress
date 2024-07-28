import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import String from "../../string";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER,SUCCESS,PRIMARY } from "../../component/Alert";
const ApexChart = () => {
  const {Alert}=useAlert()
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const handeSetChart = (series, option) => {
    console.log(series, option);
    setChartData({
      series: series,
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        xaxis: {
          type: "datetime",
          categories: option,
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      },
    });
  };
  const getChartData = async () => {
    const url = new URL(`${String.BASE_URL}/sales/monthwisesales`);
    url.searchParams.append("user_id", sessionStorage.getItem("userid"));
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        let series = generteDataAsRequired(data);
        let option = data.map((e) => e?.month);
        handeSetChart(series, option);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    }
  };
  const generteDataAsRequired = (inputData) => {
    const aggregatedData = {};

    inputData.forEach((entry) => {
      const month = entry.month;
      const monthData = entry.data;

      // Iterate through the data for each month
      monthData.forEach((item) => {
        const itemName = item.name;
        const itemCount = item.count;

        // If the item name doesn't exist in aggregatedData, initialize it
        if (!aggregatedData[itemName]) {
          aggregatedData[itemName] = new Array(inputData.length).fill(0);
        }

        // Update the count for the current month
        aggregatedData[itemName][new Date(month).getMonth()] = itemCount;
      });
    });

    const result = Object.keys(aggregatedData).map((name) => ({
      name,
      data: aggregatedData[name],
    }));

    return result;
  };
  useEffect(() => {
    getChartData();
  }, []);
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={"200%"}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
