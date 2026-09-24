import React, { useRef } from "react";
import FormInput from "../components/FormInput";
import { Camera, Trash2, User } from "lucide-react";

interface StepProps {
  data: any;
  updateData: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Personal({ data, updateData, onNext, onBack }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (data.firstName && data.lastName && data.title) {
      onNext();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    updateData({ avatar: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full animate-[slideUpFade_0.4s_ease-out_forwards]">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Personal Information
        </h2>
        <p className="text-gray-400 text-sm">Tell us a bit about yourself and upload a profile photo.</p>
      </div>

      <div className="flex flex-col gap-6 mb-10 flex-1">
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#1A2235] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
              {data.avatar ? (
                <img src={data.avatar} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-500" />
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              aria-label="Change photo"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1">
            <h3 className="text-white text-sm font-medium">Profile Picture (Optional)</h3>
            <p className="text-gray-400 text-xs">Upload a clear photo. Supports JPG, PNG or WebP up to 2MB.</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#00DC82]" />
                {data.avatar ? "Change Photo" : "Upload Photo"}
              </button>

              {data.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput
            label="First Name"
            value={data.firstName || ""}
            onChange={(val) => updateData({ firstName: val })}
            placeholder="John"
            required
          />
          <FormInput
            label="Last Name"
            value={data.lastName || ""}
            onChange={(val) => updateData({ lastName: val })}
            placeholder="Doe"
            required
          />
        </div>
        
        {/* Professional Title */}
        <FormInput
          label="Professional Title"
          value={data.title || ""}
          onChange={(val) => updateData({ title: val })}
          placeholder="e.g. CEO, Founder, Marketing Director"
          required
        />
      </div>

      <div className="mt-auto flex gap-4">
        <button
          onClick={onBack}
          className="w-1/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 bg-transparent border border-white/20 hover:border-white/50 text-white"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!data.firstName || !data.lastName || !data.title}
          className="w-2/3 py-4 rounded-xl font-semibold text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#00DC82] hover:bg-[#00c574] text-black shadow-lg shadow-green-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
}
