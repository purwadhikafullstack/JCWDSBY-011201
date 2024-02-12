import { ResponsivePie } from '@nivo/pie';
import { useEffect, useState } from 'react';
import { getCategory } from '../../helpers/queryData';

const WidgetCategory  = ({
  data,
}) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    getCategory(setCategoryData);
  }, [])
// console.log(categoryData);
  return <div className=" border-2 pt-3 h-80 lg:h-96 rounded-md shadow-lg">
    <p className='font-bold text-center text-2xl'>Category</p>
    <div className='h-80 relative'>
    <ResponsivePie
          data={categoryData.map((val) => {return {id: val.name, label: val.name, value: val.productCount}})}
          margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.7}
          padAngle={0.7}
          cornerRadius={2}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                0.2
              ]
            ]
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          layers={['arcs', 'arcLabels', 'arcLinkLabels', <text x={50} y={50} key={1} className='text-black'>tes</text>]}
        />
        {/* <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <p className='text-center text-5xl'>{categoryData.length}</p>
          <p className='text-2xl'>Categories</p>
        </div> */}
    </div>
  </div>
};

export default WidgetCategory;