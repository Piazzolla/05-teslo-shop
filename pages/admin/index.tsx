import { DashboardOutlined } from "@mui/icons-material"
import { AdminLayout } from "../../components/layouts"

const DashboardPage = () => {
  return (
    <AdminLayout
        title='Dashboard'
        subTitle="Estadisticas generales"
        icon={ <DashboardOutlined />}
    >
        <h3>Hola mUndo</h3>
    </AdminLayout>
  )
}

export default DashboardPage