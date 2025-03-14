type TagHeaderProps = {
    title: string;
    description: string;
};

export function TagHeader({ title, description }: TagHeaderProps) {
    return (
        <div className="w-full max-w-7xl min-h-fit border overflow-hidden rounded-lg ">
            <div className="bg-blue-900 w-full min-h-3"></div>
            <div className="bg-white border-b w-full">
                <div className="  p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{title}</h1>
                            <p className="text-gray-700">{description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-blue-700 hover:bg-blue-700/90 text-white px-6 py-2 rounded-md font-medium">
                                Follow
                            </button>
                            <button className="bg-white hover:bg-gray-100 border px-6 py-2 rounded-md font-medium">
                                Hide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonTagHeader() {
    return (
        <div className="w-full max-w-7xl min-h-fit border overflow-hidden rounded-lg ">
            <div className="bg-blue-900 w-full min-h-3"></div>
            <div className="bg-white border-b w-full">
                <div className="  p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl text-transparent font-bold mb-2">
                                Tag
                            </h1>
                            <p className="text-transparent">dsa</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-blue-700 hover:bg-blue-700/90 text-white px-6 py-2 rounded-md font-medium">
                                Follow
                            </button>
                            <button className="bg-white hover:bg-gray-100 border px-6 py-2 rounded-md font-medium">
                                Hide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
