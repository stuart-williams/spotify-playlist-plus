import React, { useRef, FunctionComponent } from "react";
import { NextSeo } from "next-seo";
import { connect, ConnectedProps } from "react-redux";
import githubIcon from "simple-icons/icons/github";
import { RootState } from "../../redux";
import { selectUser } from "../../redux/user";
import {
  Toaster,
  IToastProps,
  ProgressBar,
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Button,
  AnchorButton,
  Menu,
  MenuItem,
  Popover,
  Position,
  Intent,
} from "@blueprintjs/core";
import Navigation from "../Navigation";
import Icon from "../Icon";
import { Toast, ToastProvider } from "../../common/toast";
import SEO from "../../common/seo";

const mapState = (state: RootState) => ({
  user: selectUser(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  title?: string;
  primaryComponent: FunctionComponent;
};

const Layout = ({ user, title, primaryComponent }: Props) => {
  const Component = primaryComponent;
  const toaster = useRef<Toaster>();
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

  const toast: Toast = {
    showPending: (props: Pick<IToastProps, "icon"> = {}) => {
      toaster.current?.show({
        timeout: 0,
        message: (
          <ProgressBar
            className="Layout__toast-progress"
            intent={Intent.PRIMARY}
            value={100}
          />
        ),
        ...props,
      });
    },
    showSuccess: (props: Pick<IToastProps, "message">) => {
      toaster.current?.show({
        icon: "tick",
        intent: Intent.SUCCESS,
        ...props,
      });
    },
    showError: (props: Pick<IToastProps, "message">) => {
      toaster.current?.show({
        icon: "warning-sign",
        message: props.message || "Unknown Error",
        intent: Intent.DANGER,
      });
    },
    clear: () => {
      toaster.current?.clear();
    },
  };

  return (
    <>
      <NextSeo title={title ? `${title} | ${SEO.title}` : undefined} />
      <Toaster
        ref={(ref: Toaster) => (toaster.current = ref)}
        position={Position.TOP}
      />
      <ToastProvider value={toast}>
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
            <div className="Layout__primary-panel">
              <Component />
            </div>
          </div>
        </div>
      </ToastProvider>
    </>
  );
};

export default connector(Layout);
