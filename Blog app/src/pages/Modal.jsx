import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ open, setOpen, children }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center ">
        <Dialog.Panel
          className="w-full max-w-sm max-h-[90vh] bg-white rounded-2xl shadow-lg overflow-y-auto relative"
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <X size={22} />
          </button>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
