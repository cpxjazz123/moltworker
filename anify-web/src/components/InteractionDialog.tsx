import type { DialogContent } from "./GaussSplattingScene/types";
import { GameOverlayPanel } from "./GameOverlayPanel";

interface InteractionDialogProps {
  content: DialogContent;
  onClose: () => void;
}

export function InteractionDialog({ content, onClose }: InteractionDialogProps) {
  return (
    <GameOverlayPanel onClose={onClose} position="center" title={content.title}>
      {/* Content */}
      <div className="text-white/80">
        {content.contentType === "text" ? (
          <p className="whitespace-pre-wrap">{content.text}</p>
        ) : (
          <img
            alt={content.title}
            className="w-full max-h-[60vh] object-contain rounded-lg"
            src={content.imageUrl}
          />
        )}
      </div>
    </GameOverlayPanel>
  );
}
