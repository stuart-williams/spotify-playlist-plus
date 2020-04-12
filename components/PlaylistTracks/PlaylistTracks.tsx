import "./PlaylistTracks.scss";

import React, { useState } from "react";
import arrayMove from "array-move";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import Track from "../Track";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
};

const PlaylistTracks = ({ playlist }: Props) => {
  const [tracks, setTracks] = useState(playlist.tracks.items);

  const handleDragEnd = (result: DropResult) => {
    if (result.destination) {
      setTracks(
        arrayMove(tracks, result.source.index, result.destination.index)
      );
    }
  };

  const renderDraggable = (item: SpotifyApi.PlaylistTrackObject) => (
    provided: DraggableProvided
  ) => (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Track {...item} />
    </li>
  );

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
      className="PlaylistTracks bp3-list-unstyled"
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
