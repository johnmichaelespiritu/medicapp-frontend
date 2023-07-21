import MainLayout from "src/components/main/MainLayout.vue";
import Login from "src/components/main/Log-in.vue";
import SignUp from "src/components/main/Sign-up.vue";
import EmailVerification from "src/components/main/EmailVerification.vue";
import ForgotPassword from "src/components/main/ForgotPassword.vue";
import DashboardInformation from "src/pages/Dashboard/main/Dashboard-Information.vue";
import DoctorInformation from "src/pages/Doctor-Information/main/Doctor-Information.vue";
import PatientInformation from "src/pages/Patient-Information/main/Patient-Information.vue";
import ConsultationInformation from "src/pages/Consultation-Information/main/Consultation-Information.vue";

const routes = [
  {
    path: "/",
    component: Login,
    children: [
      { path: "/signup", component: SignUp },
      { path: "/emailverification", component: EmailVerification },
      { path: "/forgotpassword", component: ForgotPassword },
    ],
  },
  {
    path: "/home",
    component: MainLayout,
    children: [
      { path: "/home/dashboard-information", component: DashboardInformation },
      { path: "/home/doctor-information", component: DoctorInformation },
      { path: "/home/patient-information", component: PatientInformation },
      {
        path: "/home/consultation-information",
        component: ConsultationInformation,
      },
    ],
  },
];

export default routes;
