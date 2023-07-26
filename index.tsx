/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "layouts/dashboards";
import DashboardNavbar from "components/Nav/Navbars/DashboardNavbar";
import Footer from "components/Footer";
// // Data
// import mockData from "layouts/dashboards/deidentify/data/mockData";

import AnnotationTool from "components/Annotation/AnnotationTool";
import NotificationWidget from "components/Notifications/NotificationWidget";
import AnnotationSelector from "components/Annotation/AnnotationSelector";

function DeIdentify(): JSX.Element {
  const actionButtons = (
    <>
      <Tooltip title="Refresh" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">refresh</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={6}>
          <Grid container spacing={3}>
            <Grid item xs={3} />
            <Grid item xs={6}>
              {/* <Grid container item justifyContent="center" alignItems="center" xs={12} md={6}>
                <AnnotationSelector />
              </Grid> */}
              <MDBox xs={12}>
                <AnnotationTool />
              </MDBox>
            </Grid>
            <Grid item xs={3} />
          </Grid>
        </MDBox>
      </MDBox>
      <NotificationWidget />
      <Footer />
    </DashboardLayout>
  );
};

// export default DeidentifyForm;
export default DeIdentify;
