import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import StudySessionDetail from "../components/Home/StudySection/StudySessionDetail";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import CreateNote from "../pages/Dashboard/Student/CreateNote";
import CreateStudySession from "../pages/Dashboard/Tutor/CreateStudySession";
import UploadMaterial from "../pages/Dashboard/Tutor/UploadMaterial";
import ViewMaterials from "../pages/Dashboard/Tutor/ViewMaterials";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AllStudySessions from "../pages/Dashboard/Admin/AllStudySessions ";
import Profile from "../pages/Dashboard/Common/Profile";
import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentConfirmation from "../pages/Payment/PaymentConfirmation";
import ViewBookedSessions from "../pages/Dashboard/Student/ViewBookedSessions";
import ManageNotes from "../pages/Dashboard/Student/ManageNotes";
import ViewAllStudySessions from "../pages/Dashboard/Tutor/ViewAllStudySessions";
import Home from "../pages/Home/Home";
import UpdateStudySession from "../pages/Dashboard/Admin/UpdateStudySession";
import ViewAllMaterials from "../pages/Dashboard/Admin/ViewAllMaterials";
import ViewAllStudyMaterials from "../pages/Dashboard/Student/ViewAllStudyMaterials";
import {
  AnnouncementsList,
  CreateAnnouncement,
} from "../pages/Dashboard/Common/Announcements";
import AdminRoute from "./AdminRoute";
import TutorRoute from "./TutorRoute";
import UpdateMaterial from "../pages/Dashboard/Tutor/UpdateMaterialForm";
import AdminAccess from "../pages/SignUp/AdminAccess";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/session_detail/:id",
        element: (
          <PrivateRoute>
            <StudySessionDetail></StudySessionDetail>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
            <PaymentPage></PaymentPage>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment_confirmation",
        element: (
          <PrivateRoute>
            <PaymentConfirmation></PaymentConfirmation>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/not_found",
    element: <ErrorPage></ErrorPage>,
  },
  {
    path: "/sign_up",
    element: <SignUp></SignUp>,
  },
  {
    path: "/admin_access",
    element: <AdminAccess></AdminAccess>,
  },
  {
    path: "/sign_in",
    element: <SignIn></SignIn>,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <AnnouncementsList></AnnouncementsList>
          </PrivateRoute>
        ),
      },
      {
        path: "booked_session",
        element: (
          <PrivateRoute>
            <ViewBookedSessions></ViewBookedSessions>
          </PrivateRoute>
        ),
      },
      {
        path: "create_note",
        element: (
          <PrivateRoute>
            <CreateNote></CreateNote>
          </PrivateRoute>
        ),
      },
      {
        path: "manage_notes",
        element: (
          <PrivateRoute>
            <ManageNotes></ManageNotes>
          </PrivateRoute>
        ),
      },
      {
        path: "view_study_materials",
        element: (
          <PrivateRoute>
            <ViewAllStudyMaterials></ViewAllStudyMaterials>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      // Tutor
      {
        path: "create_study_session",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <CreateStudySession></CreateStudySession>
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "view_all_study_sessions",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <ViewAllStudySessions></ViewAllStudySessions>
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "upload_material",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <UploadMaterial></UploadMaterial>
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "view_materials",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <ViewMaterials></ViewMaterials>
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "update-material/:id",
        element: (
          <PrivateRoute>
            <TutorRoute>
              <UpdateMaterial></UpdateMaterial>
            </TutorRoute>
          </PrivateRoute>
        ),
      },
      // Admin
      {
        path: "create-announcement",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <CreateAnnouncement></CreateAnnouncement>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage_users",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageUsers></ManageUsers>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage_study_sessions",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AllStudySessions></AllStudySessions>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "update-study-session/:sessionId",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UpdateStudySession></UpdateStudySession>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage_materials",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewAllMaterials></ViewAllMaterials>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default Routes;
