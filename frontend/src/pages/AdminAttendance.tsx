import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import DisplayAttendance from "@/components/DisplayAttendance";

const AdminAttendance = () => {
  return (
    <>
      <div className="nav">
        <AdminSidebar />
      </div>
      <AdminHeader />
      <div className="main">
        <DisplayAttendance />
      </div>
    </>
  );
};

export default AdminAttendance;
