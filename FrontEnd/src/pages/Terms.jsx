import React from "react";

function Terms() {
  return (
    <div style={styles.page}>
      <h2 style={{ color: "#0b1c2d" }}>Terms & Conditions</h2>

      <p style={{ color: "#0b1c2d" }}>
        By using Snap2Fix, users agree to comply with the terms and conditions
        outlined below. These terms govern the use of the system and its
        features.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Users are responsible for providing accurate and genuine information
        when submitting complaints. Any misuse of the system, including false
        reporting, may result in restricted access.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Administrators reserve the right to update, modify, or remove complaints
        that violate community guidelines or system policies.
      </p>

      <p style={{ color: "#0b1c2d" }}>
        Snap2Fix is intended for complaint management purposes only and should
        not be used for emergency situations. The system administrators are not
        liable for delays caused by incorrect information or system misuse.
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

export default Terms;
