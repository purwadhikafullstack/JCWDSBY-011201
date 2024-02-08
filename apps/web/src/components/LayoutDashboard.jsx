import { useState } from "react"
import AdminSidebar from "./AdminSidebar"
import ContainerAdmin from "./ContainerAdmin"
import MobileSidebar from "./MobileSidebar"
import DashboardHeader from "./topbar/DashboardHeader"

const LayoutDashboard = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <ContainerAdmin>
      <DashboardHeader onClick={() => setIsOpen(true)}/>
      <MobileSidebar show={isOpen} onClose={() => setIsOpen(false)}/>
      <AdminSidebar />
      {children}
    </ContainerAdmin>
  </>
}

export default LayoutDashboard;