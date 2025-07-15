import React, { useState, useEffect } from 'react';

// You'd typically put your CSS in a separate file (e.g., SarahChenProfile.css)
// and import it: import './SarahChenProfile.css';
// For this conversion, I'm providing it as a string.
const styles = `
    :root {
        --primary-blue: #4299e1; /* A softer blue */
        --primary-green: #48bb78; /* A vibrant green */
        --secondary-gray: #e2e8f0; /* Lighter gray for borders/backgrounds */
        --text-dark: #2d3748;
        --text-medium: #4a5568;
        --text-light: #718096;
        --bg-light: #f7fafc;
        --bg-white: #ffffff;
        --border-color: #e2e8f0;
        --shadow-light: rgba(0, 0, 0, 0.05);
        --shadow-medium: rgba(0, 0, 0, 0.1);
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--bg-light);
        color: var(--text-dark);
        line-height: 1.6;
    }

    .container {
        max-width: 1080px; /* Slightly adjusted max-width */
        margin: 0 auto;
        padding: 0 24px; /* Increased padding */
    }

    /* Header */
    .header {
        background: var(--bg-white);
        border-bottom: 1px solid var(--border-color);
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: var(--shadow-light); /* Added subtle shadow */
    }

    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1080px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo {
        width: 48px; /* Slightly larger logo */
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-green) 0%, #38b2ac 100%); /* Green gradient */
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 20px; /* Larger font */
    }

    .brand-info h1 {
        font-size: 22px; /* Larger heading */
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 2px;
    }

    .brand-info p {
        font-size: 14px;
        color: var(--text-medium);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 16px; /* Increased gap */
    }

    .btn {
        padding: 10px 20px; /* More generous padding */
        border-radius: 8px; /* Slightly more rounded */
        font-size: 15px; /* Slightly larger font */
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px; /* Increased gap for icon */
    }

    .btn:hover {
        transform: translateY(-1px); /* Subtle lift on hover */
    }

    .btn-primary {
        background: var(--primary-blue);
        color: white;
        border: none;
    }

    .btn-primary:hover {
        background: #3182ce; /* Darker shade on hover */
        box-shadow: var(--shadow-medium);
    }

    .btn-secondary {
        background: var(--bg-white);
        color: var(--text-medium);
        border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
        background: var(--bg-light);
        border-color: #a0aec0;
        color: var(--text-dark);
        box-shadow: var(--shadow-light);
    }

    /* Main Content */
    .main-content {
        display: grid;
        grid-template-columns: 1fr 340px; /* Slightly wider sidebar */
        gap: 32px; /* Increased gap */
        margin-top: 32px; /* Increased margin */
    }

    /* Profile Info Sidebar */
    .profile-sidebar {
        background: var(--bg-white);
        border-radius: 12px; /* More rounded corners */
        padding: 32px; /* More generous padding */
        height: fit-content;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-medium); /* Added shadow */
    }

    .profile-header {
        text-align: center;
        margin-bottom: 24px;
    }

    .profile-avatar {
        width: 96px; /* Larger avatar */
        height: 96px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Original purple gradient */
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 38px; /* Larger font */
        margin: 0 auto 16px;
        border: 3px solid var(--primary-blue); /* Added border */
    }

    .profile-name {
        font-size: 24px; /* Larger name */
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 4px;
    }

    .profile-username {
        font-size: 15px;
        color: var(--text-medium);
        margin-bottom: 20px; /* Increased margin */
    }

    .profile-bio {
        font-size: 15px;
        color: var(--text-medium);
        line-height: 1.6;
        margin-bottom: 28px; /* Increased margin */
    }

    .profile-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 columns for larger screens */
        gap: 20px; /* Increased gap */
        margin-bottom: 28px;
    }

    .stat-item {
        text-align: center;
        padding: 16px; /* More padding */
        border-radius: 8px;
        background: var(--bg-light);
        border: 1px solid var(--border-color); /* Added subtle border */
    }

    .stat-number {
        font-size: 22px; /* Larger number */
        font-weight: 700;
        color: var(--primary-blue); /* Highlighted color */
        display: block;
    }

    .stat-label {
        font-size: 13px;
        color: var(--text-light);
        margin-top: 6px;
        position: relative;
    }

    .stat-label .tooltip-info {
        cursor: help;
    }

    /* Tooltip for OGD Points */
    .tooltip-info .tooltip-text {
        visibility: hidden;
        width: 180px;
        background-color: var(--text-dark);
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 8px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%; /* Position the tooltip above the text */
        left: 50%;
        margin-left: -90px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 12px;
        line-height: 1.4;
    }

    .tooltip-info .tooltip-text::after {
        content: " ";
        position: absolute;
        top: 100%; /* At the bottom of the tooltip */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--text-dark) transparent transparent transparent;
    }

    .tooltip-info:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }


    .achievements {
        margin-bottom: 28px;
    }

    .section-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-light);
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-bottom: 16px; /* Increased margin */
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
    }

    .achievement-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        font-size: 15px;
        color: var(--text-medium);
    }

    .achievement-icon {
        width: 24px; /* Larger icon */
        height: 24px;
        border-radius: 50%;
        background: #ffc107; /* Yellow */
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .achievement-text {
        font-size: 14px;
        color: var(--text-medium);
    }

    .social-links p {
        font-size: 14px;
        color: var(--text-medium);
        margin-top: 8px;
    }

    .social-links a {
        color: var(--primary-blue);
        text-decoration: none;
        font-size: 14px;
        margin-right: 12px;
    }

    .social-links a:hover {
        text-decoration: underline;
    }

    /* Content Area */
    .content-area {
        background: var(--bg-white);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        overflow: hidden;
        box-shadow: var(--shadow-medium);
    }

    /* Navigation Tabs */
    .nav-tabs {
        display: flex;
        background: var(--bg-light);
        border-bottom: 1px solid var(--border-color);
    }

    .nav-tab {
        flex: 1;
        padding: 18px 24px; /* More padding */
        background: none;
        border: none;
        font-size: 16px; /* Larger font */
        font-weight: 600;
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s ease; /* Smooth transition */
        position: relative;
    }

    .nav-tab:hover {
        color: var(--text-dark);
        background: #f1f5f9;
    }

    .nav-tab.active {
        color: var(--primary-blue);
        background: var(--bg-white);
    }

    .nav-tab.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px; /* Thicker underline */
        background: var(--primary-blue);
        transform: scaleX(1);
        transition: transform 0.3s ease-in-out; /* Smooth underline animation */
    }

    .nav-tab:not(.active)::after {
        transform: scaleX(0);
    }

    /* Content Panels */
    .tab-content {
        padding: 24px; /* More padding */
    }

    .tab-panel {
        display: none;
        animation: fadeIn 0.5s ease-out; /* Fade-in animation */
    }

    .tab-panel.active {
        display: block;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Content Items */
    .content-item {
        display: flex;
        gap: 16px; /* Increased gap */
        padding: 24px 0; /* More padding */
        border-bottom: 1px solid #f1f3f4;
        transition: background-color 0.2s ease;
    }

    .content-item:last-child {
        border-bottom: none;
    }

    .content-item:hover {
        background-color: #f8f9fa;
    }

    .content-avatar {
        width: 48px; /* Slightly larger avatar */
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 18px;
        flex-shrink: 0;
    }

    .content-body {
        flex: 1;
    }

    .content-header {
        display: flex;
        align-items: baseline; /* Align text baselines */
        gap: 8px;
        margin-bottom: 8px;
    }

    .content-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-dark);
    }

    .content-meta {
        font-size: 13px;
        color: var(--text-light);
    }

    .content-text {
        font-size: 15px;
        color: var(--text-dark);
        line-height: 1.6;
        margin-bottom: 16px; /* Increased margin */
    }

    .content-actions {
        display: flex;
        gap: 20px; /* Increased gap */
        align-items: center;
    }

    .action-btn {
        background: none;
        border: none;
        font-size: 14px;
        color: var(--text-medium);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px; /* Increased gap */
        padding: 6px 10px;
        border-radius: 6px;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background: var(--bg-light);
        color: var(--text-dark);
    }

    .action-btn.active {
        color: var(--primary-blue); /* Blue for active state */
        background: var(--secondary-gray); /* Light background for active state */
    }

    .action-btn .fas {
        font-size: 16px;
    }

    /* Filter/Sort Controls */
    .content-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px; /* Increased margin */
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
    }

    .sort-dropdown {
        background: var(--bg-white);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 8px 16px; /* More padding */
        font-size: 14px;
        color: var(--text-medium);
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .sort-dropdown:focus,
    .sort-dropdown:hover {
        border-color: var(--primary-blue);
    }

    /* Responsive Design */
    @media (max-width: 900px) {
        .main-content {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: 24px;
        }

        .profile-sidebar {
            order: -1; /* Move sidebar above content on mobile */
            padding: 24px;
        }

        .profile-stats {
            grid-template-columns: repeat(4, 1fr); /* Keep 4 columns for stats */
            gap: 12px;
        }

        .stat-number {
            font-size: 18px;
        }

        .stat-label {
            font-size: 11px;
        }

        .header-actions {
            flex-direction: column;
            gap: 10px;
        }

        .btn {
            width: 100%;
            justify-content: center;
        }

        .nav-tabs {
            flex-direction: column;
        }

        .nav-tab {
            text-align: left;
        }

        .content-item {
            flex-direction: column; /* Stack avatar and content on small screens */
            align-items: flex-start;
        }

        .content-avatar {
            margin-bottom: 8px;
        }

        .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
    }

    @media (max-width: 500px) {
        .container {
            padding: 0 16px;
        }
        .header-content {
            padding: 0 16px;
        }
        .profile-stats {
            grid-template-columns: repeat(2, 1fr); /* 2 columns for very small screens */
        }
        .logo {
            width: 40px;
            height: 40px;
            font-size: 18px;
        }
        .brand-info h1 {
            font-size: 18px;
        }
        .brand-info p {
            font-size: 13px;
        }
    }
`;

function SarahChenProfile() {
    const [activeTab, setActiveTab] = useState('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    const [postLikes, setPostLikes] = useState({
        'bike-lanes': 42,
        'community-garden': 28,
        'housing-town-hall': 67,
    });
    const [commentLikes, setCommentLikes] = useState({
        'public-transit': 15,
        'climate-plan': 22,
    });

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
    };

    const handleLikeClick = (type, id) => {
        if (type === 'post') {
            setPostLikes(prevLikes => ({
                ...prevLikes,
                [id]: prevLikes[id] + (prevLikes[id] === 42 ? -1 : 1) // Toggle logic
            }));
        } else if (type === 'comment') {
            setCommentLikes(prevLikes => ({
                ...prevLikes,
                [id]: prevLikes[id] + (prevLikes[id] === 15 || prevLikes[id] === 22 ? -1 : 1) // Toggle logic
            }));
        }
    };

    // This useEffect is for applying the CSS string
    // In a real app, you'd import a .css file.
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Clean up the style tag on component unmount
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            {/* Header */}
            <div className="header">
                <div className="header-content">
                    <div className="logo-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="logo">CC</div>
                        <div className="brand-info">
                            <h1>Sarah Chen</h1>
                            <p>u/sarahc_advocate</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button
                            className={`btn ${isFollowing ? 'btn-following' : 'btn-primary'}`}
                            onClick={handleFollowToggle}
                            style={isFollowing ? { background: 'var(--primary-green)', color: 'white' } : {}}
                        >
                            {isFollowing ? <i className="fas fa-check"></i> : <i className="fas fa-user-plus"></i>}
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button className="btn btn-secondary">
                            <i className="fas fa-comment-dots"></i> Start Chat
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="main-content">
                    {/* Content Area */}
                    <div className="content-area">
                        <div className="nav-tabs">
                            <button
                                className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => handleTabClick('overview')}
                                data-tab="overview"
                            >
                                Overview
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                                onClick={() => handleTabClick('posts')}
                                data-tab="posts"
                            >
                                Posts
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'comments' ? 'active' : ''}`}
                                onClick={() => handleTabClick('comments')}
                                data-tab="comments"
                            >
                                Comments
                            </button>
                        </div>

                        <div className="tab-content">
                            {/* Overview Tab */}
                            <div className={`tab-panel ${activeTab === 'overview' ? 'active' : ''}`} id="overview">
                                <div className="content-controls">
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)' }}>Recent Activity</h3>
                                    <select className="sort-dropdown">
                                        <option>All Activity</option>
                                        <option>Posts Only</option>
                                        <option>Comments Only</option>
                                    </select>
                                </div>
                                <div className="content-item">
                                    <div className="content-avatar">SC</div>
                                    <div className="content-body">
                                        <div className="content-header">
                                            <span className="content-title">Posted in r/CivicEngagement</span>
                                            <span className="content-meta">• 2 hours ago</span>
                                        </div>
                                        <div className="content-text">New bike lanes approved for Main Street! 🚴‍♀️ After months of community advocacy, the city council finally approved the protected bike lane project.</div>
                                        <div className="content-actions">
                                            <button className="action-btn active" onClick={() => handleLikeClick('post', 'bike-lanes')}>
                                                <i className="fas fa-thumbs-up"></i> {postLikes['bike-lanes']}
                                            </button>
                                            <button className="action-btn"><i className="fas fa-reply"></i> Reply</button>
                                            <button className="action-btn"><i className="fas fa-share-alt"></i> Share</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Posts Tab */}
                            <div className={`tab-panel ${activeTab === 'posts' ? 'active' : ''}`} id="posts">
                                <div className="content-controls">
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)' }}>Posts</h3>
                                    <select className="sort-dropdown">
                                        <option>New</option>
                                        <option>Top</option>
                                        <option>Hot</option>
                                    </select>
                                </div>

                                <div className="content-item">
                                    <div className="content-avatar">SC</div>
                                    <div className="content-body">
                                        <div className="content-header">
                                            <span className="content-title">r/CivicEngagement</span>
                                            <span className="content-meta">• Looking for bike infrastructure advocacy tips</span>
                                        </div>
                                        <div className="content-text">
                                            <strong>sarahc_advocate</strong> commented 2 hr. ago
                                            <br /><br />
                                            Great news everyone! The city council just approved the protected bike lane project for Main Street. This is a huge win for sustainable transportation and shows what we can accomplish when we work together as a community.
                                        </div>
                                        <div className="content-actions">
                                            <button className={`action-btn ${postLikes['bike-lanes'] === 42 ? 'active' : ''}`} onClick={() => handleLikeClick('post', 'bike-lanes')}>
                                                <i className="fas fa-thumbs-up"></i> {postLikes['bike-lanes']}
                                            </button>
                                            <button className="action-btn"><i className="fas fa-reply"></i> Reply</button>
                                            <button className="action-btn"><i className="fas fa-share-alt"></i> Share</button>
                                            <button className="action-btn"><i className="fas fa-ellipsis-h"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="content-item">
                                    <div className="content-avatar">SC</div>
                                    <div className="content-body">
                                        <div className="content-header">
                                            <span className="content-title">r/UrbanPlanning</span>
                                            <span className="content-meta">• Community Garden Workshop - April 2024</span>
                                        </div>
                                        <div className="content-text">
                                            <strong>1 day ago</strong>
                                            <br /><br />
                                            Join us at Riverside Park this Saturday for a hands-on workshop about starting community gardens. We'll cover soil preparation, plant selection, and organizing neighborhood growing spaces. Free event, all skill levels welcome! 🌱
                                        </div>
                                        <div className="content-actions">
                                            <button className={`action-btn ${postLikes['community-garden'] === 28 ? 'active' : ''}`} onClick={() => handleLikeClick('post', 'community-garden')}>
                                                <i className="fas fa-thumbs-up"></i> {postLikes['community-garden']}
                                            </button>
                                            <button className="action-btn"><i className="fas fa-share-alt"></i> Share</button>
                                            <button className="action-btn"><i className="fas fa-ellipsis-h"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="content-item">
                                    <div className="content-avatar">SC</div>
                                    <div className="content-body">
                                        <div className="content-header">
                                            <span className="content-title">r/LocalGovernment</span>
                                            <span className="content-meta">• Housing Affordability Town Hall Results</span>
                                        </div>
                                        <div className="content-text">
                                            <strong>3 days ago</strong>
                                            <br /><br />
                                            Great turnout at last night's housing forum! Key takeaways: 73% support for inclusionary zoning, strong interest in co-housing initiatives, and need for better tenant protections. Full report available on city website.
                                        </div>
                                        <div className="content-actions">
                                            <button className={`action-btn ${postLikes['housing-town-hall'] === 67 ? 'active' : ''}`} onClick={() => handleLikeClick('post', 'housing-town-hall')}>
                                                <i className="fas fa-thumbs-up"></i> {postLikes['housing-town-hall']}
                                            </button>
                                            <button className="action-btn"><i className="fas fa-share-alt"></i> Share</button>
                                            <button className="action-btn"><i className="fas fa-ellipsis-h"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Tab */}
                            <div className={`tab-panel ${activeTab === 'comments' ? 'active' : ''}`} id="comments">
                                <div className="content-controls">
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)' }}>Comments</h3>
                                    <select className="sort-dropdown">
                                        <option>New</option>
                                        <option>Top</option>
                                        <option>Controversial</option>
                                    </select>
                                </div>

                                <div className="content-item">
                                    <div className="content-avatar">SC</div>
                                    <div className="content-body">
                                        <div className="content-header">
                                            <span className="content-title">r/PublicTransit</span>
                                            <span className="content-meta">• Transit Expansion Proposal Discussion</span>
                                        </div>
                                        <div className="content-text">
                                            <strong>sarahc_advocate</strong> commented 4 hr. ago
                                            <br /><br />
                                            Absolutely agree with this proposal! The east side has been underserved for too long. We need to prioritize equity in our transit planning. I'd love to see more community input sessions scheduled.
                                        </div>
                                        <div className="content-actions">
                                            <button className={`action-btn ${commentLikes['public-transit'] === 15 ? 'active' : ''}`} onClick={() => handleLikeClick('comment', 'public-transit')}>
                                                <i className="fas fa-thumbs-up"></i> {commentLikes['public-transit']}
                                            </button>
                                            <button className="action-btn"><i className="fas fa-reply"></i> Reply</button>
                                            <button className="action-btn"><i className="fas fa-share-alt"></i> Share</button>
                                            <button className="action-btn"><i className="fas fa-ellipsis-h"></i></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="content-item">
                                    <div className="content-avatar">SC</div>
                                    <div className="content-body">
                                        <div className="content-header">
                                            <span className="content-title">r/ClimateAction</span>
                                            <span className="content-meta">• Climate Action Plan Draft Feedback</span>
                                        </div>
                                        <div className="content-text">
                                            <strong>1 day ago</strong>
                                            <br /><br />
                                            The renewable energy targets look ambitious but achievable. However, I think we need stronger language around building efficiency standards and incentives for retrofitting older buildings.
                                        </div>
                                        <div className="content-actions">
                                            <button className={`action-btn ${commentLikes['climate-plan'] === 22 ? 'active' : ''}`} onClick={() => handleLikeClick('comment', 'climate-plan')}>
                                                <i className="fas fa-thumbs-up"></i> {commentLikes['climate-plan']}
                                            </button>
                                            <button className="action-btn"><i className="fas fa-reply"></i> Reply</button>
                                            <button className="action-btn"><i className="fas fa-ellipsis-h"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Sidebar */}
                    <div className="profile-sidebar">
                        <div className="profile-header">
                            <div className="profile-avatar">SC</div>
                            <h2 className="profile-name">Sarah Chen</h2>
                            <p className="profile-username">u/sarahc_advocate</p>
                            <p className="profile-bio">Community advocate & urban planner passionate about sustainable cities. Working to make our neighborhoods more livable, equitable, and green.</p>
                        </div>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">1,234</span>
                                <span className="stat-label">
                                    <span className="tooltip-info">OGD Points
                                        <span className="tooltip-text">Open Government & Democracy Points: A measure of a user's positive contributions to civic discourse and action within CivicConnect. Earned through upvotes on posts/comments, successful advocacy, and community engagement.</span>
                                    </span>
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">38</span>
                                <span className="stat-label">Posts</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">2y</span>
                                <span className="stat-label">Member Since</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number"><i className="fas fa-fire"></i> 15</span>
                                <span className="stat-label">Active Communities</span>
                            </div>
                        </div>

                        <div className="achievements">
                            <h3 className="section-title">Achievements</h3>
                            <div className="achievement-item">
                                <div className="achievement-icon" style={{ background: '#ffecb3' }}><i className="fas fa-trophy" style={{ color: '#d49f00' }}></i></div>
                                <span className="achievement-text">Nice Post, Feed Finder</span>
                            </div>
                            <div className="achievement-item">
                                <div className="achievement-icon" style={{ background: '#c5edf5' }}><i className="fas fa-star" style={{ color: '#007bff' }}></i></div>
                                <span className="achievement-text">Profile Perfectionist</span>
                            </div>
                            <div className="achievement-item">
                                <div className="achievement-icon" style={{ background: '#e6e6fa' }}><i className="fas fa-gem" style={{ color: '#8a2be2' }}></i></div>
                                <span className="achievement-text">Community Champion</span>
                            </div>
                            <a href="#" style={{ fontSize: '13px', color: 'var(--primary-blue)', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>View all achievements <i className="fas fa-arrow-right fa-xs"></i></a>
                        </div>

                        <div className="social-links">
                            <h3 className="section-title">Social Links</h3>
                            <p>Connect with Sarah on other platforms:</p>
                            <div style={{ marginTop: '10px' }}>
                                <a href="#"><i className="fab fa-twitter-square fa-lg"></i> Twitter</a>
                                <a href="#"><i className="fab fa-linkedin fa-lg"></i> LinkedIn</a>
                                <a href="#"><i className="fas fa-globe fa-lg"></i> Website</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SarahChenProfile;