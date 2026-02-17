// dialog wrapper is the base component for all dialogs
// so it creates the portal & does the background as well as styles

import { createPortal } from "react-dom";

export default function DialogWrapper({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // keep rendering the component even if not open, but just make it invisible, so that the animation can work
  
  return createPortal(
    <div className={`fixed inset-0 flex items-center justify-center transition-all ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {/* fake background */}
      <div
        onClick={() => {
          // assume clicking outside
          onClose();
        }}
        className="absolute inset-0 w-screen h-screen bg-[#0F0F10] opacity-80 backdrop-blur-3xl"
      />
      <div className={`bg-white text-black border border-[#2D2D2D] rounded-lg p-4 w-96 z-20 transition-all transform ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
