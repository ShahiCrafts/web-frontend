import React, { useRef, useEffect, useState } from 'react';
import {
    FileText,
    Edit3,
    UploadCloud,
    X,
    Plus,
    ChevronDown,
    Eye,
    Code,
} from 'lucide-react';
import FormSection from '../common/FormSection';
import FormInput from '../common/FormInput';
import { useFetchTags } from '../../../../hooks/admin/useTagTan';

const FormTextArea = React.forwardRef(({ id, helpText, ...props }, ref) => (
    <div>
        <textarea
            id={id}
            ref={ref}
            className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-b-md transition-shadow"
            rows={4}
            {...props}
        />
        {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}
    </div>
));

const MarkdownRenderer = ({ text }) => {
    const parseInline = (line) => {
        const parts = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .split(/(<strong>.*?<\/strong>|<em>.*?<\/em>)/g);

        return parts.map((part, index) => {
            if (part.startsWith('<strong>')) return <strong key={index}>{part.slice(8, -9)}</strong>;
            if (part.startsWith('<em>')) return <em key={index}>{part.slice(4, -5)}</em>;
            return part;
        });
    };

    const blocks = text.split('\n\n');
    return (
        <div className="w-full p-3 border border-t-0 border-gray-300 rounded-b-md bg-white min-h-[122px]">
            <div className="prose prose-sm max-w-none">
                {blocks.map((block, i) => {
                    if (block.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-3 text-gray-800">{parseInline(block.substring(2))}</h1>;
                    if (block.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-3 mb-2 text-gray-700">{parseInline(block.substring(3))}</h2>;
                    if (block.startsWith('- ') || block.startsWith('* ')) {
                        const items = block.split('\n').map((item, j) => (
                            <li key={j} className="ml-6 list-disc text-gray-700">{parseInline(item.substring(2))}</li>
                        ));
                        return <ul key={i} className="mb-4">{items}</ul>;
                    }
                    if (block.trim() !== '') return <p key={i} className="mb-4 leading-relaxed text-gray-700">{parseInline(block)}</p>;
                    return null;
                })}
            </div>
        </div>
    );
};

export const parseTagsFromContent = (content) => {
    const regex = /#(\w+)/g;
    const matches = content.match(regex) || [];
    return [...new Set(matches.map(tag => tag.substring(1)))];
};

export default function DiscussionForm({
    title, setTitle,
    content, setContent,
    tags, setTags,
    community, setCommunity,
    attachments, setAttachments
}) {
    const { data } = useFetchTags(); // ✅ Hook usage here
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tagDropdown, setTagDropdown] = useState({ isOpen: false, query: '', filteredTags: [] });
    const [editorMode, setEditorMode] = useState('write');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const contentWrapperRef = useRef(null);
    const textAreaRef = useRef(null);

    const mockCommunities = [
        { id: 'general', name: 'General', description: 'Post publicly for everyone to see', image: 'https://placehold.co/40x40/F97316/FFFFFF?text=G' },
        { id: 'env', name: 'r/Environment', description: 'Latest news and updates', image: 'https://placehold.co/40x40/22C55E/FFFFFF?text=E' },
        { id: 'heritage', name: 'r/Public Heritage', description: 'Preserving local culture', image: 'https://placehold.co/40x40/A855F7/FFFFFF?text=H' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
            if (contentWrapperRef.current && !contentWrapperRef.current.contains(event.target)) setTagDropdown(prev => ({ ...prev, isOpen: false }));
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            attachments.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
        };
    }, [attachments]);

    const handleSelectCommunity = (comm) => {
        setCommunity(comm);
        setDropdownOpen(false);
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);

        const extractedTags = parseTagsFromContent(newContent);
        setTags(extractedTags);

        const cursorPosition = e.target.selectionStart;
        const textUpToCursor = newContent.substring(0, cursorPosition);
        const tagRegex = /(?:^|\s)#(\w*)$/;
        const match = textUpToCursor.match(tagRegex);

        if (match && data?.tags) {
            const query = match[1].toLowerCase();
            const filtered = data.tags.filter(t => t.name.toLowerCase().startsWith(query));
            setTagDropdown({ isOpen: filtered.length > 0, query, filteredTags: filtered.map(t => t.name) });
        } else {
            setTagDropdown(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleTagSelect = (tag) => {
        const tagStartIndex = content.lastIndexOf('#');
        if (tagStartIndex === -1) return;

        const textBeforeTag = content.substring(0, tagStartIndex);
        const textAfterTag = content.substring(tagStartIndex + 1 + tagDropdown.query.length);
        const newContent = `${textBeforeTag}#${tag} ${textAfterTag}`;

        setContent(newContent);
        setTags(parseTagsFromContent(newContent));

        setTagDropdown({ isOpen: false, query: '', filteredTags: [] });

        const newCursorPosition = tagStartIndex + 1 + tag.length + 1;
        setTimeout(() => {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
                textAreaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        }, 0);
    };

    const processFiles = (fileList) => {
        if (!fileList) return;
        const accepted = Array.from(fileList).filter(f => f.type.startsWith('image/'));
        const limited = accepted.slice(0, 5 - attachments.length);
        const previews = limited.map(f => ({ id: crypto.randomUUID(), file: f, preview: URL.createObjectURL(f), status: 'uploading', progress: 0 }));
        if (!previews.length) return;
        setAttachments(prev => [...prev, ...previews]);

        previews.forEach(fileObj => {
            const interval = setInterval(() => {
                setAttachments(prev =>
                    prev.map(f => f.id === fileObj.id && f.progress < 100 ? { ...f, progress: f.progress + 20 } : f)
                );
            }, 200);
            setTimeout(() => {
                clearInterval(interval);
                setAttachments(prev =>
                    prev.map(f => f.id === fileObj.id ? { ...f, status: 'completed', progress: 100 } : f)
                );
            }, 1200);
        });
    };

    const handleRemoveFile = (id) => {
        const file = attachments.find(f => f.id === id);
        if (file?.preview) URL.revokeObjectURL(file.preview);
        setAttachments(prev => prev.filter(f => f.id !== id));
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); };

    return (
        <form className="space-y-8 bg-white mx-auto">
            <FormSection icon={FileText} title="Basic Information">
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full border border-gray-300 rounded-md bg-white px-3 py-2 text-left flex items-center justify-between">
                            {community ? (
                                <div className="flex items-center gap-3">
                                    <img src={community.image} alt={community.name} className="w-8 h-8 rounded-full" />
                                    <div><p className="text-gray-900 font-medium">{community.name}</p></div>
                                </div>
                            ) : (<span className="text-gray-500">Select a community or post publicly</span>)}
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg">
                                {mockCommunities.map((comm) => (
                                    <li key={comm.id} onClick={() => handleSelectCommunity(comm)} className="cursor-pointer select-none py-2 px-3 hover:bg-gray-100">
                                        <div className="flex items-center gap-3">
                                            <img src={comm.image} alt={comm.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-medium text-gray-800">{comm.name}</p>
                                                <p className="text-xs text-gray-500">{comm.description}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <FormInput id="title" label="Title" placeholder="What's your post about?" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required={true} helpText="Be specific and descriptive" />
                </FormSection>

            <FormSection icon={Edit3} title="Content">
                <div className="relative" ref={contentWrapperRef}>
                    <div className="flex border-b border-gray-300 -mb-px">
                        <button type="button" onClick={() => setEditorMode('write')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-b-0 rounded-t-md transition-colors ${editorMode === 'write' ? 'bg-white text-[#ff5c00] border-gray-300' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}>
                            <Code size={16} /> Write
                        </button>
                        <button type="button" onClick={() => setEditorMode('preview')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-b-0 rounded-t-md transition-colors ${editorMode === 'preview' ? 'bg-white text-[#ff5c00] border-gray-300' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}>
                            <Eye size={16} /> Preview
                        </button>
                    </div>
                    {editorMode === 'write' ? (
                        <>
                            <FormTextArea ref={textAreaRef} id="content" value={content} onChange={handleContentChange} helpText="Use markdown for formatting and #tag for categories." />
                            {tagDropdown.isOpen && (
                                <ul className="absolute z-10 top-full max-h-48 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg mt-[-80px]">
                                    {tagDropdown.filteredTags.map(tag => (
                                        <li key={tag} onClick={() => handleTagSelect(tag)} className="cursor-pointer select-none py-2 px-3 hover:bg-gray-100">
                                            <p className="font-medium text-gray-800">#{tag}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <MarkdownRenderer text={content} />
                    )}
                </div>
            </FormSection>

            <FormSection icon={UploadCloud} title="Media">
                <input type="file" ref={fileInputRef} onChange={(e) => processFiles(e.target.files)} multiple accept="image/*" className="hidden" />
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={attachments.length === 0 ? () => fileInputRef.current.click() : undefined} className={`w-full p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${attachments.length === 0 ? 'cursor-pointer bg-gray-100/50' : 'bg-gray-50 cursor-default'} ${isDragging ? 'border-[#ff5c00] bg-[#ff5c00]/10' : 'border-slate-100'}`}>
                    {attachments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-[#ff5c00]/20' : 'bg-gray-200/80'}`}>
                                <UploadCloud className={`w-10 h-10 transition-colors ${isDragging ? 'text-[#ff5c00]' : 'text-slate-500'}`} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700"><span className="text-[#ff5c00]">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, or GIF. Max 10MB each (up to 5 images)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            {attachments.map(file => (
                                <div key={file.id} className="relative w-28 h-28 rounded-lg shadow-md overflow-hidden group">
                                    <img src={file.preview} alt={file.file.name} className={`w-full h-full object-cover transition-all ${file.status === 'uploading' ? 'blur-sm scale-110' : ''}`} />
                                    {file.status === 'uploading' && (
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs"><p>Uploading</p><div className="w-20 bg-gray-400 rounded-full h-1 mt-1"><div className="bg-white h-1 rounded-full" style={{ width: `${file.progress}%` }} /></div></div>
                                    )}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveFile(file.id); }} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"><X size={14} /></button>
                                </div>
                            ))}
                            {attachments.length < 5 && (
                                <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} className="w-28 h-28 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:text-[#ff5c00] hover:border-[#ff5c00] transition-colors"><Plus size={28} /></button>
                            )}
                        </div>
                    )}
                </div>
            </FormSection>
        </form>
    );
}
