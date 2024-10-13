import { Banana } from "lucide-react";
import React from "react";

type Props = {
  onClick: () => void;
  play: boolean;
};

function TogglePlayButton({ onClick, play }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-32 h-14 flex justify-center items-center space-x-4 bg-white rounded-lg p-4 z-50"
    >
      {play ? (
        <span>Reset</span>
      ) : (
        <div className="flex items-center space-x-4">
          <span>Rain</span>
          <Banana size={18} />
        </div>
      )}
    </button>
  );
}

export default TogglePlayButton;
