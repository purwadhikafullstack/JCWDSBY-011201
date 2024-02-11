import { useState } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import LoadingSpinner from "../../components/LoadingSpinner";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";


const SalesReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return <LayoutDashboard>
    <LoadingSpinner isLoading={isLoading} size={16} />
    <LayoutPageAdmin title='Sales Report'>
      
    </LayoutPageAdmin>
  </LayoutDashboard>
};

export default SalesReport;