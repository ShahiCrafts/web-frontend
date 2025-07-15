import { ArrowLeft, Eye, Save, Send } from 'lucide-react';
import IconWrapper from './IconWrapper';

export default function PostHeader() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="text-gray-600 hover:text-gray-900">
                        <IconWrapper icon={ArrowLeft} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Create New Post</h1>
                        <p className="text-gray-500 mt-1">Share your thoughts with the community</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="hidden sm:flex items-center justify-center p-2 text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50"
                        title="Preview"
                    >
                        <IconWrapper icon={Eye} />
                    </button>
                    <button
                        className="hidden sm:flex items-center justify-center p-2 text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50"
                        title="Save Draft"
                    >
                        <IconWrapper icon={Save} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-lg hover:bg-[#f25700]">
                        <IconWrapper icon={Send} />
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
}
