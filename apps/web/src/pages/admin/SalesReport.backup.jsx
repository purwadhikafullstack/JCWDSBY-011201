import { useEffect, useState } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import LoadingSpinner from "../../components/LoadingSpinner";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { getMonthlySales } from "../../helpers/queryData";
import { Table } from "flowbite-react";
import { customTable } from "../../helpers/flowbiteCustomTheme";

const SalesReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [monthlySalesData, setMonthlySalesData] = useState(null);

  useEffect(() => {
    getMonthlySales(setMonthlySalesData, setIsLoading)
  }, [])
// console.log('Monthly Sales : ', monthlySalesData);
  const dummyData = [
    {
      month: 'January',
      sales: 1000
    },
    {
      month: 'February',
      sales: 2000
    },
    {
      month: 'March',
      sales: 500
    },
    {
      month: 'April',
      sales: 500
    }
  ]
  const dummyDataLine = [
    {
      id: 'Cosmo SBY',
      data: [
        {
          x: 'January',
          y: 1000
        },
        {
          x: 'February',
          y: 1500
        },
        {
          x: 'March',
          y: 500
        },
        {
          x: 'April',
          y: 2000
        }
      ]
    },
  ]
  const chartLineData = (chartData) => {
    const data = chartData.map((val) => {return {x: val.month, y: parseInt(val.salesTotal/1000)}})
    const result = [{
      id: chartData[0].storeName,
      data
    }]
    return result
  }
  // console.log('dummyData :', monthlySalesData && chartLineData(monthlySalesData));
  // console.log('dummyData :', monthlySalesData);
  return <LayoutDashboard>
    <LoadingSpinner isLoading={isLoading} size={16} />
    <LayoutPageAdmin title='Sales Report'>
      <div className="h-96 border border-black">
        <ResponsiveBar
          data={dummyData}
          keys={['sales']}
          indexBy={'month'}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Sales',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
          }}
        />
      </div>
      <div className="grid grid-cols-1">
      <div className="flex h-96 mt-5 border border-black">
        <div className="h-full w-1/2">
          {
            monthlySalesData && <ResponsiveLine
            // data={dummyDataLine}
            data={monthlySalesData && chartLineData(monthlySalesData)}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              // min: 'auto',
              min: 'auto',
              max: 'auto',
              // stacked: false,
              // reverse: false
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Month',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Sales',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
          }
        </div>
        <div className="w-1/2 border border-black">
          <Table theme={customTable}>
            <Table.Head>
              <Table.HeadCell>#</Table.HeadCell>
              <Table.HeadCell>Store</Table.HeadCell>
              <Table.HeadCell>Month</Table.HeadCell>
              <Table.HeadCell>Total Sales</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {monthlySalesData && monthlySalesData.map((val, idx) => {
                return <Table.Row key={idx}>
                  <Table.Cell>{idx+1}</Table.Cell>    
                  <Table.Cell>{val.storeName}</Table.Cell>    
                  <Table.Cell>{val.month}</Table.Cell>    
                  <Table.Cell>{val.salesTotal}</Table.Cell>    
                </Table.Row>
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
      </div>
    </LayoutPageAdmin>
  </LayoutDashboard>
};

export default SalesReport;