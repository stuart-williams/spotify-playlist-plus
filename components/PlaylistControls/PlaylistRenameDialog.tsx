import React, { useState, useEffect } from "react";
import classNames from "classnames";
import {
  Button,
  Dialog,
  EditableText,
  H2,
  Intent,
  Classes,
} from "@blueprintjs/core";

interface Props {
  name: string;
  isOpen?: boolean;
  onRequestClose?: (event?: React.SyntheticEvent<HTMLElement>) => void;
  onSubmit?: (value: string) => void;
}

export default ({ isOpen, name, onRequestClose, onSubmit }: Props) => {
  const [value, setValue] = useState(name);

  const handleClose = () => {
    setValue(name);

    if (onRequestClose) {
      onRequestClose();
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(value);
    }
  };

  useEffect(() => {
    setValue(name);
  }, [name]);

  const classes = classNames(
    "PlaylistRenameDialog__input",
    Classes.ALIGN_RIGHT
  );

  return (
    <Dialog
      className="PlaylistRenameDialog"
      isOpen={isOpen}
      title="Rename Playlist"
      onClose={handleClose}
    >
      <div className={Classes.DIALOG_BODY}>
        <H2 className={classes}>
          <EditableText
            placeholder="Playlist Name"
            value={value}
            isEditing={true}
            onChange={setValue}
          />
        </H2>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button intent={Intent.PRIMARY} onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
