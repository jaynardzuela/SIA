import GuardSidebar from "../components/GuardSidebar";
import GuardHeader from "../components/GuardHeader";

const GuardDashboard = () => {
  return (
    <>
      <div className="nav">
        <GuardSidebar />
      </div>
      <GuardHeader />
      <div className="main">
        <h1>Guard Dashboard</h1>
      </div>
    </>
  );
};

export default GuardDashboard;
