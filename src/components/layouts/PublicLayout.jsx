import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import PublicSidebar from "../public/common/PublicSidebar";
import PublicHeader from "../public/common/PublicHeader";
import CreatePostPage from "../public/create_post/common/CreatePostPage";

export default function PublicLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);

    const handleCloseCreatePost = () => setShowCreatePost(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Fixed Header */}
            <PublicHeader
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onCreatePostClick={() => setShowCreatePost(true)}
            />

            {/* Fixed Sidebar (outside flex layout) */}
            <PublicSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main content wrapper with left margin to offset sidebar and padding-top for header */}
            <main
                className="lg:pl-68 h-screen overflow-y-auto px-3 py-3"
            >
                {showCreatePost ? <CreatePostPage onClose={handleCloseCreatePost} /> : <Outlet />}
            </main>
        </div>
    );
}