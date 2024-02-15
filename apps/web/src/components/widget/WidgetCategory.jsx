import { ResponsivePie } from '@nivo/pie';
import { useEffect, useState } from 'react';
import { getCategory } from '../../helpers/queryData';
import WidgetLayoutBox from './WidgetLayoutBox';

const WidgetCategory = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    getCategory(setCategoryData);
  }, [])

  return <WidgetLayoutBox title={'Category'}>
    <ResponsivePie
      data={categoryData.map((val) => { return { id: val.name, label: val.name, value: val.productCount } })}
      margin={{ top: 10, right: 80, bottom: 80, left: 70 }}
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
  </WidgetLayoutBox>
};

export default WidgetCategory;