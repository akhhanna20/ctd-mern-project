const Footer = () => {
  return (
    <footer
      style={{
        background: "teal", // Set background color
        color: "white", // Set text color
        padding: "1rem",
        textAlign: "center", // Center-align the text
        position: "absolute", // Ensure the footer stays at the bottom
        bottom: 0,
        width: "100%",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Hanna Akhramchuk. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
