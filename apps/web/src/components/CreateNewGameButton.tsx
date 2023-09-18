import React, { useState } from "react";
import { useGamesMutations } from "@deal/hooks";
import { handleError } from "../utils/shared";
import { useNavigate } from "react-router-dom";

const CreateNewGameButton: React.FC = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const { createGameMutation } = useGamesMutations();

  const onClickCreateNewGame = async () => {
    try {
      setIsCreating(true);
      const data = await createGameMutation.mutateAsync();
      navigate(`/games/${data.id}`);
    } catch (err) {
      handleError(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClickCreateNewGame}
      disabled={isCreating}
      className="rounded-md bg-[#ADC4D7] hover:bg-[#ADC4D7]/80 px-3.5 py-2.5 text-sm font-semibold text-body shadow-sm"
    >
      {isCreating ? "Creating..." : "New Game"}
    </button>
  );
};

export default CreateNewGameButton;
