import CustomCursor from "../components/common/CustomCursor";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export default function MainLayout({ children, settings }) {
  return (
    <>
      <CustomCursor />
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
