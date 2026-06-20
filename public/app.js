// public/app.js
const API_URL = window.location.origin; // Dynamically gets http://localhost:5000
let currentUserId = null;

// DOM Elements
const timelineContainer = document.getElementById('posts-timeline');
const postInput = document.getElementById('post-input');
const submitPostBtn = document.getElementById('submit-post-btn');
const currentUserDisplay = document.getElementById('current-user');

// 🚀 1. INITIALIZE APP ON LOAD
document.addEventListener('DOMContentLoaded', async () => {
    await setupTestUser();
    await fetchTimeline();
});

// 🔒 2. AUTOMATIC ACCOUNT CONFIGURATION FOR TESTING
async function setupTestUser() {
    try {
        // We'll attempt to register a default simulation account
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Rana_Ali',
                email: 'ranaali@test.com',
                password: 'password123'
            })
        });

        // Try logging in to grab the active user's ObjectId
        const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'ranaali@test.com', password: 'password123' })
        });
        
        const data = await loginResponse.json();
        if (data.user) {
            currentUserId = data.user.id;
            currentUserDisplay.textContent = data.user.username;
            console.log("👤 Session Active User ID:", currentUserId);
        }
    } catch (err) {
        console.error("Authentication setup failed:", err);
    }
}

// 📰 3. FETCH & RENDER POST TIMELINE
async function fetchTimeline() {
    try {
        const response = await fetch(`${API_URL}/api/posts`);
        const posts = await response.json();

        if (posts.length === 0) {
            timelineContainer.innerHTML = `<div class="loading-placeholder">🏜️ The timeline is quiet. Be the first to say something!</div>`;
            return;
        }

        timelineContainer.innerHTML = ''; // Clear loading message

        posts.forEach(post => {
            // Safe fallback checking if the relational data is populated
            const author = post.user ? post.user.username : 'Anonymous';
            const likesCount = post.likes ? post.likes.length : 0;
            const date = new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <div class="post-header">
                    <span class="post-author">👤 @${author}</span>
                    <span class="post-time">• ${date}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="like-btn" onclick="toggleLike('${post._id}')">
                        ❤️ <span id="likes-${post._id}">${likesCount}</span> Likes
                    </button>
                </div>
            `;
            timelineContainer.appendChild(postCard);
        });
    } catch (err) {
        timelineContainer.innerHTML = `<div class="loading-placeholder" style="color:red;">❌ Unable to display stream. Check backend terminal.</div>`;
    }
}

// 📝 4. PUBLISH A NEW POST
submitPostBtn.addEventListener('click', async () => {
    const textContent = postInput.value.trim();

    if (!textContent) {
        alert("Please write something before publishing!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: currentUserId,
                content: textContent
            })
        });

        if (response.ok) {
            postInput.value = ''; // Clean input workspace
            await fetchTimeline(); // Instantly update the feed view
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (err) {
        console.error("Publishing error:", err);
    }
});

// ❤️ 5. LIKE TOGGLE MANAGER
window.toggleLike = async function(postId) {
    try {
        const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId })
        });
        
        const data = await response.json();
        if (response.ok) {
            // Update the count target text instantly without redrawing the page
            document.getElementById(`likes-${postId}`).textContent = data.likesCount;
        }
    } catch (err) {
        console.error("Liking interaction error:", err);
    }
};
// 🤝 6. FOLLOW SYSTEM WORKSPACE MANAGER
const followToggleBtn = document.getElementById('follow-toggle-btn');
const followersCountText = document.getElementById('followers-count');
const followingCountText = document.getElementById('following-count');

// Simulation Target: A dummy ObjectId representing another user profile in your system
const targetUserSimulationId = "60c72b2f9b1d8b2bad756789"; 

// Update counters on the UI panel
async function updateFollowStats() {
    if (!currentUserId) return;
    try {
        const response = await fetch(`${API_URL}/api/follow/counts/${currentUserId}`);
        const stats = await response.json();
        
        followersCountText.textContent = stats.followersCount;
        followingCountText.textContent = stats.followingCount;
    } catch (err) {
        console.error("Could not fetch network stats:", err);
    }
}

// Attach Event Listener to the follow button
followToggleBtn.addEventListener('click', async () => {
    if (!currentUserId) return;
    
    try {
        const response = await fetch(`${API_URL}/api/follow/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                followerId: currentUserId,      // You
                followingId: targetUserSimulationId // The target simulation account
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            // Update button UI style dynamically based on relation status
            if (data.isFollowing) {
                followToggleBtn.textContent = "Unfollow Account";
                followToggleBtn.style.background = "#cc0000";
            } else {
                followToggleBtn.textContent = "Follow Test Account";
                followToggleBtn.style.background = "#007acc";
            }
            // Instantly refresh numbers
            await updateFollowStats();
        }
    } catch (err) {
        console.error("Error managing relationship updates:", err);
    }
});

// Update our initial load inside DOMContentLoaded to also update metrics
// Modify your existing DOMContentLoaded call near the top of app.js to look like this:
document.addEventListener('DOMContentLoaded', async () => {
    await setupTestUser();
    await fetchTimeline();
    await updateFollowStats(); // <-- Add this inside your existing DOMContentLoaded listener!
});