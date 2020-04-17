import React, { ReactNode } from "react";
import { NextSeo } from "next-seo";
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import Navigation from "../Navigation";
import SEO from "../../common/seo";

interface Props {
  title?: string;
  primaryPanel: ReactNode;
}

export default ({ title, primaryPanel }: Props) => (
  <>
    <NextSeo title={title ? `${title} | ${SEO.title}` : undefined} />
    <div className="Layout">
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>{SEO.title}</NavbarHeading>
        </NavbarGroup>
      </Navbar>
      <div className="Layout__body">
        <Navigation />
        <div className="Layout__primary-panel">{primaryPanel}</div>
      </div>
    </div>
  </>
);
