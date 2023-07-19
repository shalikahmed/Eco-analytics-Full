import "./green.css"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Commutedata from "../../components/commute-data/commutedata"
const Green = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Commutedata/>
      </div>
    </div>
  )
}

export default Green