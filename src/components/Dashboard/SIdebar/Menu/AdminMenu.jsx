import MenuItem from "./MenuItem";
import { FaUsersCog } from "react-icons/fa";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import { AiOutlineControl } from "react-icons/ai";

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUsersCog} label="Manage Users" address="manage_users" />
      <MenuItem
        icon={ManageHistoryIcon}
        label="All Study Sessions"
        address="manage_study_sessions"
      />
      <MenuItem
        icon={AiOutlineControl}
        label="Manage All Materials"
        address="manage_materials"
      />
    </>
  );
};

export default AdminMenu;
