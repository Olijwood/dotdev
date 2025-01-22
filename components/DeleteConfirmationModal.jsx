export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-94 text-center">
                <h2 className="text-lg font-bold text-gray-800">
                    Confirm Deletion
                </h2>
                <p className="mt-2 text-gray-600">
                    Are you sure you want to delete this post?
                </p>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
