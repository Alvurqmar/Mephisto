import { observer } from "mobx-react";
import gameActions from "./gameActions";
import DiscardView from "../views/discardView";

const DiscardController = observer(() => {
  const slot = gameActions.pendingSlot;

  if (!gameActions.discardModal || !slot) return null;

  return (
    <DiscardView
      row={slot.row}
      col={slot.col}
      onClose={() => {
        gameActions.cancelDiscard();
      }}
    />
  );
});

export default DiscardController;
