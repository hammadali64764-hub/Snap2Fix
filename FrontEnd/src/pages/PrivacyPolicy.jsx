import React from "react";

function PrivacyPolicy() {
  return (
    <div style={styles.page}>
      <h2 style={{ color: "#0b1c2d" }}>Privacy Policy</h2>

      <p style={{ color: "#0b1c2d" }}>
        Snap2Fix is committed to protecting the privacy of its users. This
        Privacy Policy explains how user information is collected, used, and
        safeguarded within the system.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Personal information such as name, contact details, and complaint data
        is collected solely for the purpose of complaint registration, tracking,
        and resolution.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        User data is accessible only to authorized personnel such as system
        administrators and relevant staff members. No personal information is
        shared with third parties without user consent.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Appropriate security measures are implemented to protect data from
        unauthorized access, misuse, or loss. Users are encouraged to keep
        their login credentials confidential.
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

export default PrivacyPolicy;
