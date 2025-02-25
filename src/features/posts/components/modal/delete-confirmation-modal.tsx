type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="w-auto rounded-lg bg-white px-12 py-4 text-center shadow-lg">
                <h2 className="text-lg font-bold text-gray-800">
                    Confirm Deletion
                </h2>
                <p className="mt-2 text-gray-600">
                    Are you sure you want to delete this post?
                </p>

                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
