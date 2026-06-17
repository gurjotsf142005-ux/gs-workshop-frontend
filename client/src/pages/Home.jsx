import { useEffect, useState } from "react";
import WaveDivider from "../components/common/WaveDivider";
import MainLayout from "../layouts/MainLayout";
import { mergeSiteSettings, siteSettingsDefaults } from "../data/siteData";
import { getPublicSettings } from "../services/api";
import About    from "../sections/About";
import Contact  from "../sections/Contact";
import Features from "../sections/Features";
import Hero     from "../sections/Hero";
import Marquee  from "../sections/Marquee";
import Projects from "../sections/Projects";
import Stats    from "../sections/Stats";

export default function Home() {
  const [settings, setSettings] = useState(siteSettingsDefaults);

  useEffect(() => {
    let alive = true;
    getPublicSettings()
      .then((d) => { if (alive) setSettings(mergeSiteSettings(d.settings)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <MainLayout settings={settings}>
      <Hero     settings={settings} />
      <Marquee  settings={settings} />
      <Stats    settings={settings} />
      <WaveDivider from="cream" to="white" variant="one" />
      <Features settings={settings} />
      <WaveDivider from="white" to="cream" variant="two" />
      <Projects settings={settings} />
      <About    settings={settings} />
      <Contact  settings={settings} />
    </MainLayout>
  );
}
