import React, { useState, useEffect } from "react";
import classNames from "classnames";
import arrayMove from "array-move";
import * as playlistsApi from "../../api/playlists";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
  DraggableStateSnapshot,
  resetServerContext,
} from "react-beautiful-dnd";
import Track from "../Track";
import { Classes } from "@blueprintjs/core";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = ({ playlist }: Props) => {
  const [tracks, setTracks] = useState(playlist.tracks.items);

  useEffect(() => {
    setTracks(playlist.tracks.items);
  }, [playlist.snapshot_id]);

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      const from = result.source.index;
      const to = result.destination.index;

      playlistsApi.reorderTrack(playlist.id, from, to);
      setTracks(arrayMove(tracks, from, to));
    }
  };

  const renderDraggable = (item: SpotifyApi.PlaylistTrackObject) => (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    const style = {
      ...provided.draggableProps.style,
      opacity: snapshot.isDragging ? "0.8" : "1",
    };

    return (
      <li
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={style}
      >
        <Track track={item.track} />
      </li>
    );
  };

  const renderTrack = (item: SpotifyApi.PlaylistTrackObject, i: number) => {
    if (item.track) {
      return (
        <Draggable key={item.track.id} draggableId={item.track.id} index={i}>
          {renderDraggable(item)}
        </Draggable>
      );
    }
  };

  const renderDroppable = (provided: DroppableProvided) => (
    <ul
      className={classNames("PlaylistTracks", Classes.LIST_UNSTYLED)}
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      {tracks.map(renderTrack)}
    </ul>
  );

  resetServerContext();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">{renderDroppable}</Droppable>
    </DragDropContext>
  );
};

export default PlaylistTracks;
