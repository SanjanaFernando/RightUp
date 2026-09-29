"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react";
import { BlogType, createBlogAction, updateBlogAction } from "@/actions/blogs";

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  blogToEdit?: BlogType | null;
}

const CATEGORIES = [
  "Marketing & Growth",
  "Strategic Networking",
  "Global Expansion",
  "Business Leadership",
  "Tech & Innovation",
  "Community & Scaling",
];

export default function BlogEditorModal({
  isOpen,
  onClose,
  onSaved,
  blogToEdit,
}: BlogEditorModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [readTime, setReadTime] = useState("5 min read");
  const [image, setImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(["", ""]);
  const [sections, setSections] = useState<
    { heading?: string; subheading?: string; body: string; quote?: string; list?: string[] }[]
  >([{ heading: "Introduction", body: "", quote: "" }]);
  const [tagsInput, setTagsInput] = useState("Growth, Strategy, Leadership");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate data when editing
  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title || "");
      setSlug(blogToEdit.slug || "");
      setCategory(blogToEdit.category || CATEGORIES[0]);
      setReadTime(blogToEdit.readTime || "5 min read");
      setImage(blogToEdit.image || "");
      setExcerpt(blogToEdit.excerpt || "");
      setKeyTakeaways(
        blogToEdit.keyTakeaways && blogToEdit.keyTakeaways.length > 0
          ? blogToEdit.keyTakeaways
          : [""]
      );
      setSections(
        blogToEdit.sections && blogToEdit.sections.length > 0
          ? blogToEdit.sections
          : [{ heading: "Introduction", body: "" }]
      );
      setTagsInput((blogToEdit.tags || []).join(", "));
      setFeatured(Boolean(blogToEdit.featured));
      setPublished(blogToEdit.published !== false);
    } else {
      // Reset defaults for new blog
      setTitle("");
      setSlug("");
      setCategory(CATEGORIES[0]);
      setReadTime("5 min read");
      setImage("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80");
      setExcerpt("");
      setKeyTakeaways(["Key takeaway 1", "Key takeaway 2"]);
      setSections([
        {
          heading: "The Modern Playbook",
          body: "Enter your strategic analysis and business insights here...",
          quote: "Quality relationships compound faster than linear ad spend.",
        },
      ]);
      setTagsInput("Growth, Strategy, B2B");
      setFeatured(false);
      setPublished(true);
    }
    setError(null);
  }, [blogToEdit, isOpen]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!blogToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Image Upload handler (resizes / compresses via canvas to lightweight base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = Math.min(img.width, MAX_WIDTH);
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setImage(dataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim() || !excerpt.trim()) {
      setError("Please fill in Title, Image, and Excerpt.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (blogToEdit) {
        const res = await updateBlogAction(blogToEdit._id, {
          title,
          slug,
          category,
          readTime,
          image,
          excerpt,
          keyTakeaways,
          sections,
          tags,
          featured,
          published,
        });
        if (!res.success) {
          setError(res.error || "Failed to update blog.");
          setIsSaving(false);
          return;
        }
      } else {
        const res = await createBlogAction({
          title,
          slug,
          category,
          readTime,
          image,
          excerpt,
          keyTakeaways,
          sections,
          tags,
          featured,
          published,
        });
        if (!res.success) {
          setError(res.error || "Failed to create blog.");
          setIsSaving(false);
          return;
        }
      }

      setIsSaving(false);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#0A0F1D] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-[slideUpFade_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-[#0E1528]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {blogToEdit ? "Edit Blog Article" : "Create New Blog Article"}
              </h2>
              <p className="text-xs text-gray-400">
                Manage content stored in MongoDB database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Mastering Cross-Border Strategic Partnerships"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                URL Slug (auto-generated) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mastering-cross-border-strategic-partnerships"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 transition-colors font-mono text-xs"
              />
            </div>
          </div>

          {/* Row 2: Category & Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white text-sm focus:outline-none focus:border-green-400 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0A0F1D] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 6 min read"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Image (URL + File Upload) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">
              Featured Image URL or Upload *
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-green-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-green-400" />
                <span>Upload File</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Live Image Preview */}
            {image && (
              <div className="relative aspect-[21/9] w-full max-h-48 rounded-2xl overflow-hidden border border-white/10 bg-gray-900 mt-2">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Row 4: Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Article Excerpt / Summary *
            </label>
            <textarea
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief executive summary of this article that appears on blog cards and search results..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-400 transition-colors resize-none"
            />
          </div>

          {/* Row 5: Key Takeaways (Dynamic List) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300">
                Key Takeaways / Executive Highlights
              </label>
              <button
                type="button"
                onClick={() => setKeyTakeaways([...keyTakeaways, ""])}
                className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>
            {keyTakeaways.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...keyTakeaways];
                    next[idx] = e.target.value;
                    setKeyTakeaways(next);
                  }}
                  placeholder={`Takeaway point #${idx + 1}`}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#070B12] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-green-400"
                />
                {keyTakeaways.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setKeyTakeaways(keyTakeaways.filter((_, i) => i !== idx))}
                    className="p-2 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Row 6: Content Sections Builder */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Article Content Sections</h4>
                <p className="text-[11px] text-gray-400">
                  Add body paragraphs, headings, and pull quotes
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSections([
                    ...sections,
                    { heading: "New Section", body: "", quote: "" },
                  ])
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold hover:bg-green-500/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                    Section {idx + 1}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSections(sections.filter((_, i) => i !== idx))}
                      className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={sec.heading || ""}
                  onChange={(e) => {
                    const next = [...sections];
                    next[idx].heading = e.target.value;
                    setSections(next);
                  }}
                  placeholder="Section Heading (optional)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070B12] border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-green-400"
                />

                <textarea
                  required
                  rows={4}
                  value={sec.body}
                  onChange={(e) => {
                    const next = [...sections];
                    next[idx].body = e.target.value;
                    setSections(next);
                  }}
                  placeholder="Section body text / analysis paragraph..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070B12] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-green-400 resize-none leading-relaxed"
                />

                <input
                  type="text"
                  value={sec.quote || ""}
                  onChange={(e) => {
                    const next = [...sections];
                    next[idx].quote = e.target.value;
                    setSections(next);
                  }}
                  placeholder="Highlighted pull quote (optional)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070B12] border border-white/10 text-gray-300 italic text-xs focus:outline-none focus:border-green-400"
                />
              </div>
            ))}
          </div>

          {/* Row 7: Tags & Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Strategy, Ecosystems, Australia"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070B12] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-green-400"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-green-500 focus:ring-green-400 bg-gray-900 border-white/20"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-green-500 focus:ring-green-400 bg-gray-900 border-white/20"
                />
                <span>Published (Live)</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#00DC82] hover:bg-[#00c574] text-black font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Article...</span>
                </>
              ) : (
                <>
                  <span>{blogToEdit ? "Update Article" : "Save & Publish"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
