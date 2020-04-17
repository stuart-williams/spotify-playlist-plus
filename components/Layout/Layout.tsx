import React, { ReactNode } from "react";
import { NextSeo } from "next-seo";
import { connect, ConnectedProps } from "react-redux";
import githubIcon from "simple-icons/icons/github";
import { RootState } from "../../redux";
import { selectUser } from "../../redux/user";
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Button,
  AnchorButton,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import Navigation from "../Navigation";
import Icon from "../Icon";
import SEO from "../../common/seo";

const mapState = (state: RootState) => ({
  user: selectUser(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  title?: string;
  primaryPanel: ReactNode;
};

const Layout = ({ user, title, primaryPanel }: Props) => {
  const isLoggedIn = !!user.id;

  const accountMenu = (
    <Menu>
      <MenuItem text="Logout" icon="log-out" href="/logout" />
    </Menu>
  );

  const accountIcon = isLoggedIn && (
    <Popover content={accountMenu} autoFocus={false}>
      <Button icon="user" minimal={true}>
        {user.display_name}
      </Button>
    </Popover>
  );

  return (
    <>
      <NextSeo title={title ? `${title} | ${SEO.title}` : undefined} />
      <div className="Layout">
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>{SEO.title}</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <AnchorButton
              href={process.env.REPO_URL}
              icon={<Icon path={githubIcon.path} />}
              minimal={true}
              target="_blank"
              rel="noopener noreferrer"
            />
            {accountIcon}
          </NavbarGroup>
        </Navbar>
        <div className="Layout__body">
          {isLoggedIn && <Navigation />}
          <div className="Layout__primary-panel">{primaryPanel}</div>
        </div>
      </div>
    </>
  );
};

export default connector(Layout);
