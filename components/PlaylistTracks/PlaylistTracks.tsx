import "./PlaylistTracks.scss";

import React, { useState, useEffect } from "react";
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
import * as playlistsApi from "../../api/playlists";

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
