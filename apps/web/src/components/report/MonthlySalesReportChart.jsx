import { ResponsiveBar } from "@nivo/bar";

const MonthlySalesReportChart = ({
  data,
  keys,
  indexBy,
  leftLegend,
  bottomLegend,
}) => {
  return <ResponsiveBar
    data={data}
    keys={[keys]}
    indexBy={indexBy}
    margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: leftLegend,
      legendPosition: 'middle',
      legendOffset: -60,
      truncateTickAt: 0
    }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: bottomLegend,
      legendPosition: 'middle',
      legendOffset: 32,
      truncateTickAt: 0
    }}
  />
};

export default MonthlySalesReportChart;