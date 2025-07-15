import { X, Plus } from 'lucide-react';
import IconWrapper from '../IconWrapper';

export default function TagsInput({ tags, setTags, newTag, setNewTag }) {
    const popularTags = ['environment', 'safety', 'education', 'transportation', 'housing', 'development', 'community', 'policy'];

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag) && tags.length < 10) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handlePopularTagClick = (tag) => {
        if (!tags.includes(tag) && tags.length < 10) {
            setTags([...tags, tag]);
        }
    };

    return (
        <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex items-center border border-gray-300 rounded-md p-1 flex-wrap gap-2">
                {tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm">
                        <span>{tag}</span>
                        <button onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-gray-800">
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        className="w-full min-w-[100px] p-1 focus:outline-none"
                        placeholder="Add a tag..."
                    />
                </div>
                <button onClick={handleAddTag} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                    <IconWrapper icon={Plus} />
                </button>
            </div>
            <div className="mt-2">
                <span className="text-xs text-gray-600 mr-2">Popular tags:</span>
                <div className="inline-flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                        <button key={tag} onClick={() => handlePopularTagClick(tag)} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
