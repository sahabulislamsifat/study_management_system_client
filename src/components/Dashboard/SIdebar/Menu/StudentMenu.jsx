import MenuItem from "./MenuItem";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { MdStickyNote2 } from "react-icons/md";
import SelectAllSharpIcon from "@mui/icons-material/SelectAllSharp";
import { IoCreateOutline } from "react-icons/io5";

const StudentMenu = () => {
  return (
    <>
      <MenuItem
        icon={CollectionsBookmarkIcon}
        label="View Booked Sessions"
        address="booked_session"
      />
      <MenuItem
        icon={IoCreateOutline}
        label="Create Note"
        address="create_note"
      />
      <MenuItem
        icon={MdStickyNote2}
        label="Personal Notes"
        address="manage_notes"
      />
      <MenuItem
        icon={SelectAllSharpIcon}
        label="View Study Materials"
        address="view_study_materials"
      />
    </>
  );
};

export default StudentMenu;
