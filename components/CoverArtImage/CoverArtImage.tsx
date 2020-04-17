import React from "react";
import classNames from "classnames";
import Img from "react-image";
import Icon, { notesIcon } from "../Icon";

export default ({ className, src, alt }: React.HTMLProps<HTMLImageElement>) => {
  const icon = <Icon {...notesIcon} width={32} height={32} />;

  return (
    <div className={classNames("CoverArtImage", className)}>
      <Img src={src} alt={alt} loader={icon} unloader={icon} />
    </div>
  );
};
