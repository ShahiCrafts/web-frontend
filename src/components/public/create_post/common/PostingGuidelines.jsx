export default function PostingGuidelines() {
    const guidelines = [
        { title: 'Be respectful', text: 'Keep discussions civil and constructive' },
        { title: 'Stay on topic', text: 'Make sure your post is relevant to the community' },
        { title: 'Use clear titles', text: 'Help others understand what your post is about' },
        { title: 'Add context', text: 'Provide background information when needed' }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Posting Guidelines</h3>
            <div className="space-y-4">
                {guidelines.map(item => (
                    <div key={item.title}>
                        <p className="font-medium text-sm text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};