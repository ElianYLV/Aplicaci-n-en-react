export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">

        {children}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
          >
            Cerrar
          </button>
        </div>

      </div>

    </div>
  );
}