import { useEffect } from "react";
import { useRouter } from "next/router";
import ReactGA from "react-ga";

export default () => {
  const router = useRouter();

  useEffect(() => {
    ReactGA.initialize(process.env.GA_TRACKING_ID, {
      debug: process.env.GA_DEBUG === "true",
    });
  }, []);

  useEffect(() => {
    ReactGA.set({ page: router.pathname });
    ReactGA.pageview(router.pathname);
  }, [router.asPath]);

  return null;
};
