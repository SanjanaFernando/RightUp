"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";

export interface CommentType {
  _id: string;
  blogSlug: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userTitle?: string;
  userId?: string;
  content: string;
  likes: number;
  likedBy?: string[];
  parentId?: string | null;
  createdAt: string;
}

// Curated initial mock comments and threaded replies for every blog
const INITIAL_COMMENTS: Record<string, CommentType[]> = {
  "the-world-that-marketing-built": [
    {
      _id: "mock-the-world-that-marketing-built-1",
      blogSlug: "the-world-that-marketing-built",
      userName: "Alexander Hayes",
      userTitle: "Managing Director at Apex Ventures",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      content:
        "Spot on analysis. We noticed a 40% drop in inbound lead conversion from paid search over the last 18 months. Shifting focus to verified executive networks has completely flipped our sales velocity.",
      likes: 18,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      _id: "mock-the-world-that-marketing-built-1-reply",
      blogSlug: "the-world-that-marketing-built",
      userName: "RightUp Admin",
      userTitle: "RightUp Editorial",
      userAvatar: "",
      content:
        "Spot on, Alexander. When buyer intent comes through peer trust, the typical 6-month enterprise sales cycle often contracts to just 3-4 weeks.",
      likes: 7,
      likedBy: [],
      parentId: "mock-the-world-that-marketing-built-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      _id: "mock-the-world-that-marketing-built-2",
      blogSlug: "the-world-that-marketing-built",
      userName: "Chloe Bennet",
      userTitle: "Founder & CEO, Horizon Media",
      userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      content:
        "The emphasis on 'trust-first flywheels' is exactly what we teach our portfolio founders. Quality over quantity will always win in B2B enterprise deals.",
      likes: 12,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      _id: "mock-the-world-that-marketing-built-3",
      blogSlug: "the-world-that-marketing-built",
      userName: "Liam O'Connor",
      userTitle: "Chief Commercial Officer, Sydney Tech Hub",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content:
        "Traditional marketing built pipelines full of tire-kickers. Curated ecosystems ensure you're only spending time with qualified budget-holders.",
      likes: 9,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
  ],

  "mastering-strategic-networking-2026": [
    {
      _id: "mock-mastering-strategic-networking-2026-1",
      blogSlug: "mastering-strategic-networking-2026",
      userName: "Michael Thornton",
      userTitle: "Head of Growth, Nexis Tech",
      userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      content:
        "The point about clarifying mutual value propositions before asking for intros is critical. Too many people ask for favors without offering any leverage in return.",
      likes: 15,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
    {
      _id: "mock-mastering-strategic-networking-2026-1-reply",
      blogSlug: "mastering-strategic-networking-2026",
      userName: "RightUp Admin",
      userTitle: "RightUp Editorial",
      userAvatar: "",
      content:
        "Exactly Michael. Reciprocity is the currency of high-level business networking. If you lead with generosity, relationships compound quickly.",
      likes: 6,
      likedBy: [],
      parentId: "mock-mastering-strategic-networking-2026-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      _id: "mock-mastering-strategic-networking-2026-2",
      blogSlug: "mastering-strategic-networking-2026",
      userName: "Claire Davenport",
      userTitle: "Partner at Melbourne Capital Group",
      userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      content:
        "20 deep relationships with aligned leaders beat 5,000 passive LinkedIn connections any day of the week. Great insights on maintaining relationship capital.",
      likes: 11,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ],

  "cross-border-expansion-guide": [
    {
      _id: "mock-cross-border-expansion-guide-1",
      blogSlug: "cross-border-expansion-guide",
      userName: "Seraphina Lin",
      userTitle: "Cross-Border Trade Advisor",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      content:
        "Having boots-on-the-ground allies in target APAC markets saved our clients millions in compliance and regulatory missteps. Essential read for any Australian scale-up!",
      likes: 14,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      _id: "mock-cross-border-expansion-guide-2",
      blogSlug: "cross-border-expansion-guide",
      userName: "Julian Wright",
      userTitle: "Co-Founder, AusGlobal Logistics",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      content:
        "Joint ventures with established regional players cut our time-to-market in Singapore by over 60%. De-risking through local trust is non-negotiable.",
      likes: 8,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      _id: "mock-cross-border-expansion-guide-2-reply",
      blogSlug: "cross-border-expansion-guide",
      userName: "RightUp Admin",
      userTitle: "RightUp Editorial",
      userAvatar: "",
      content:
        "Singapore and the UK are prime launchpads for Aussie firms when paired with pre-screened alliance partners. Thanks for sharing your experience Julian!",
      likes: 5,
      likedBy: [],
      parentId: "mock-cross-border-expansion-guide-2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],

  "future-of-b2b-ecosystems": [
    {
      _id: "mock-future-of-b2b-ecosystems-1",
      blogSlug: "future-of-b2b-ecosystems",
      userName: "Jonathan Blake",
      userTitle: "Enterprise SaaS Architect",
      userAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      content:
        "Ecosystem-led growth is the single most defensible moat against commodity pricing. When products bundle harmoniously, customer retention skyrockets.",
      likes: 16,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      _id: "mock-future-of-b2b-ecosystems-2",
      blogSlug: "future-of-b2b-ecosystems",
      userName: "Hannah Morales",
      userTitle: "VP of Strategic Alliances, CloudMatrix",
      userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      content:
        "We shifted 30% of our marketing budget into co-selling and ecosystem partnerships this year. The ROI has been nearly 3x our direct digital channels.",
      likes: 10,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    },
  ],

  "ai-powered-dealmaking": [
    {
      _id: "mock-ai-powered-dealmaking-1",
      blogSlug: "ai-powered-dealmaking",
      userName: "Dr. Vikram Patel",
      userTitle: "Head of Applied AI, Horizon Quant",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content:
        "Using semantic embeddings and graph analysis to map corporate synergies is revolutionizing business matching. It eliminates the hit-or-miss randomness of traditional conferences.",
      likes: 21,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    },
    {
      _id: "mock-ai-powered-dealmaking-1-reply",
      blogSlug: "ai-powered-dealmaking",
      userName: "RightUp Admin",
      userTitle: "RightUp Editorial",
      userAvatar: "",
      content:
        "Spot on Dr. Patel. The algorithm surfaces multi-dimensional compatibility, while human curators ensure the vision and culture align before introductions occur.",
      likes: 9,
      likedBy: [],
      parentId: "mock-ai-powered-dealmaking-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    },
    {
      _id: "mock-ai-powered-dealmaking-2",
      blogSlug: "ai-powered-dealmaking",
      userName: "Simon Gallagher",
      userTitle: "Angel Investor & M&A Consultant",
      userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      content:
        "The time saved in deal screening is immense. RightUp's approach to pairing algorithmic intelligence with human vetting is the future of M&A and joint ventures.",
      likes: 13,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],

  "community-driven-growth-strategies": [
    {
      _id: "mock-community-driven-growth-strategies-1",
      blogSlug: "community-driven-growth-strategies",
      userName: "Rachel Kensington",
      userTitle: "Founder & Community Lead, Aussie Scaleups",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      content:
        "'Your network is your net worth, but your community is your compound interest' — what a phenomenal quote. When members help each other win, brand advocacy takes care of itself.",
      likes: 19,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    },
    {
      _id: "mock-community-driven-growth-strategies-2",
      blogSlug: "community-driven-growth-strategies",
      userName: "Anthony Sterling",
      userTitle: "Chief Executive, Sterling Advisory",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      content:
        "Communities built on vulnerability and genuine peer learning create immense retention. We have seen customer lifetime values more than double in community-led accounts.",
      likes: 11,
      likedBy: [],
      parentId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },
  ],
};

export async function getCommentsAction(blogSlug: string): Promise<{
  success: boolean;
  comments: CommentType[];
  error?: string;
}> {
  try {
    await connectToDatabase();
    const dbComments = await Comment.find({ blogSlug }).sort({ createdAt: -1 }).lean();

    const mockComments = INITIAL_COMMENTS[blogSlug] || [];

    if (!dbComments || dbComments.length === 0) {
      return { success: true, comments: mockComments };
    }

    const formattedDbComments: CommentType[] = dbComments.map((c) => ({
      _id: c._id.toString(),
      blogSlug: c.blogSlug,
      userName: c.userName,
      userEmail: c.userEmail,
      userAvatar: c.userAvatar,
      userTitle: c.userTitle || "Verified Member",
      userId: c.userId,
      content: c.content,
      likes: c.likes || 0,
      likedBy: c.likedBy || [],
      parentId: c.parentId || null,
      createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
    }));

    // Combine DB comments and mock comments (ensuring DB comments appear first)
    const combined = [...formattedDbComments, ...mockComments];
    return { success: true, comments: combined };
  } catch (err: unknown) {
    console.error("Error fetching comments:", err);
    const mockComments = INITIAL_COMMENTS[blogSlug] || [];
    return { success: true, comments: mockComments };
  }
}

export async function addCommentAction(data: {
  blogSlug: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  userTitle?: string;
  userId?: string;
  content: string;
  parentId?: string | null;
}): Promise<{
  success: boolean;
  comment?: CommentType;
  error?: string;
}> {
  try {
    if (!data.blogSlug || !data.userName.trim() || !data.content.trim()) {
      return { success: false, error: "Name and comment content are required." };
    }

    await connectToDatabase();

    const newComment = await Comment.create({
      blogSlug: data.blogSlug,
      userName: data.userName.trim(),
      userEmail: data.userEmail?.trim(),
      userAvatar: data.userAvatar || "",
      userTitle: data.userTitle || "Verified Member",
      userId: data.userId,
      content: data.content.trim(),
      parentId: data.parentId || null,
      likes: 0,
      likedBy: [],
    });

    return {
      success: true,
      comment: {
        _id: newComment._id.toString(),
        blogSlug: newComment.blogSlug,
        userName: newComment.userName,
        userEmail: newComment.userEmail,
        userAvatar: newComment.userAvatar,
        userTitle: newComment.userTitle,
        userId: newComment.userId,
        content: newComment.content,
        likes: newComment.likes,
        likedBy: newComment.likedBy,
        parentId: newComment.parentId,
        createdAt: newComment.createdAt.toISOString(),
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add comment";
    console.error("Error adding comment:", err);
    return { success: false, error: message };
  }
}

export async function toggleLikeCommentAction(
  commentId: string,
  userIdentifier: string
): Promise<{
  success: boolean;
  likes: number;
  liked: boolean;
  error?: string;
}> {
  try {
    // If it's a mock comment, simulate like toggle
    if (commentId.startsWith("mock-")) {
      return { success: true, likes: 1, liked: true };
    }

    await connectToDatabase();
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return { success: false, error: "Comment not found", likes: 0, liked: false };
    }

    const alreadyLiked = comment.likedBy?.includes(userIdentifier);
    if (alreadyLiked) {
      comment.likedBy = comment.likedBy.filter((id: string) => id !== userIdentifier);
      comment.likes = Math.max(0, (comment.likes || 1) - 1);
    } else {
      if (!comment.likedBy) comment.likedBy = [];
      comment.likedBy.push(userIdentifier);
      comment.likes = (comment.likes || 0) + 1;
    }

    await comment.save();

    return {
      success: true,
      likes: comment.likes,
      liked: !alreadyLiked,
    };
  } catch (err: unknown) {
    console.error("Error liking comment:", err);
    return { success: false, error: "Failed to update like", likes: 0, liked: false };
  }
}
