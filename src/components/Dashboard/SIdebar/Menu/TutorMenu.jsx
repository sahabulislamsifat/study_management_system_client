import MenuItem from "./MenuItem";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { IoCreateSharp } from "react-icons/io5";
import { SiSessionize } from "react-icons/si";
import { GiExplosiveMaterials } from "react-icons/gi";

const TutorMenu = () => {
  return (
    <>
      <MenuItem
        icon={IoCreateSharp}
        label="Create Study Session"
        address="create_study_session"
      />
      <MenuItem
        icon={SiSessionize}
        label="View All Sessions"
        address="view_all_study_sessions"
      />
      <MenuItem
        icon={MdOutlineDriveFolderUpload}
        label="Upload Material"
        address="upload_material"
      />
      <MenuItem
        icon={GiExplosiveMaterials}
        label="View All Materials"
        address="view_materials"
      />
    </>
  );
};

export default TutorMenu;
