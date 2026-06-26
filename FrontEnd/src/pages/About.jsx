import React from "react";

function About() {
  return (
    <div style={styles.page}>
      <h2 style={{ color: "#0b1c2d" }}>About Snap2Fix</h2>

      <p style={{ color: "#0b1c2d" }}>
        Snap2Fix is a digital complaint management system designed to improve
        communication between residents and administration within a housing
        society or organization.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        The system allows residents to easily report issues such as maintenance
        problems, security concerns, sanitation issues, and other community-
        related complaints through an online platform.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Each complaint is recorded, tracked, and managed efficiently, ensuring
        transparency and timely resolution. Administrators can monitor all
        complaints, assign tasks, update statuses, and provide feedback to
        residents.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Snap2Fix aims to reduce manual paperwork, improve response time, and
        enhance overall resident satisfaction by providing a centralized and
        reliable complaint handling solution.
      </p>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    lineHeight: "1.6",
  },
};

export default About;
