import React, { useState } from "react";
import classNames from "classnames";
import VisibilitySensor from "react-visibility-sensor";
import Img from "react-image";
import Icon, { notesIcon } from "../Icon";

export default ({ className, src, alt }: React.HTMLProps<HTMLImageElement>) => {
  const [isVisible, setIsVisible] = useState(false);
  const icon = <Icon {...notesIcon} width={32} height={32} />;

  const handleVisibilityChange = (visible: boolean) => {
    if (!isVisible) {
      setIsVisible(visible);
    }
  };

  return (
    <VisibilitySensor onChange={handleVisibilityChange}>
      <div className={classNames("CoverArtImage", className)}>
        {isVisible && <Img src={src} alt={alt} loader={icon} unloader={icon} />}
      </div>
    </VisibilitySensor>
  );
};
