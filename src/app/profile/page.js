"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiEdit2, FiCamera, FiLogOut, FiX } from "react-icons/fi";
import { successToast, errorToast, warningToast, confirmToast } from '../../../lib/toast';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }
  }, [status, router]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Changed from isUploading for clarity
  
  // State for the saved profile data
  const [profile, setProfile] = useState({
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    bio: "AI enthusiast and developer passionate about creating intelligent solutions.",
    avatar: session?.user?.image || "/logo.png",
    stats: {
      totalChats: 0,
      totalMessages: 0,
      imagesAnalyzed: 0,
    }
  });

  // State for the form while editing
  const [editForm, setEditForm] = useState({ ...profile });
  
  // --- NEW STATE FOR STAGING IMAGE UPLOAD ---
  const [imagePreview, setImagePreview] = useState(null); // Local URL for preview
  const [imageFile, setImageFile] = useState(null);       // The actual file object for upload

  // Load profile data from database
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            const updatedProfile = {
              name: data.user.name,
              email: data.user.email,
              joinedDate: new Date(data.user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              bio: data.user.bio,
              avatar: data.user.image || "/logo.png",
              stats: data.user.stats,
            };
            setProfile(updatedProfile);
            setEditForm(updatedProfile);
          } else {
            const fallbackProfile = {
              name: session.user.name || "User",
              email: session.user.email || "",
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              bio: "AI enthusiast and developer passionate about creating intelligent solutions.",
              avatar: session.user.image || "/logo.png",
              stats: { totalChats: 0, totalMessages: 0, imagesAnalyzed: 0 },
            };
            setProfile(fallbackProfile);
            setEditForm(fallbackProfile);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [session]);

  // Cleanup for the local image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First, update the profile text fields
      const profileResponse = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name, bio: editForm.bio }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile information.');
      }

      const profileData = await profileResponse.json();
      let updatedProfile = { ...profile, name: profileData.user.name, bio: profileData.user.bio };

      // If there's a new image file, upload it separately
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const imageResponse = await fetch('/api/user/profile', {
          method: 'POST',
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload profile image.');
        }

        const imageData = await imageResponse.json();
        updatedProfile = { ...updatedProfile, avatar: imageData.imageUrl };
      }

      // Update the state with the final profile data
      setProfile(updatedProfile);
      setEditForm(updatedProfile);

      // Reset staging states after successful save
      setImageFile(null);
      setImagePreview(null);
      setIsEditing(false);

      successToast('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      errorToast(error.message || 'An error occurred while updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setEditForm({ ...profile });
    // Also reset the staged image
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        warningToast('Please select an image file.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        warningToast('Image must be less than 5MB.');
        return;
    }

    // Revoke the old preview URL if it exists
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }

    // Set the new file and create a preview URL for it
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };


  const handleDeleteImage = async () => {
    const confirmed = await confirmToast(
      'Are you sure you want to delete your profile picture?',
      async () => {
        setIsSaving(true);
        try {
          const response = await fetch('/api/user/profile', {
            method: 'DELETE',
          });

          if (response.ok) {
            const updatedProfile = {
              ...profile,
              avatar: session?.user?.image || "/logo.png",
            };
            setProfile(updatedProfile);
            setEditForm(updatedProfile);
            // Ensure any local preview is also cleared
            setImageFile(null);
            setImagePreview(null);
            successToast('Profile picture deleted successfully!');
          } else {
            errorToast('Failed to delete profile picture.');
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          errorToast('An error occurred while deleting the image.');
        } finally {
          setIsSaving(false);
        }
      }
    );
  };
  
  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: '/login' });
  };
  
  if (status === "loading" || isSigningOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isSigningOut ? "Signing out..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }
  
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <FiArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign Out"
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Signing out...</span>
                </>
              ) : (
                <>
                  <FiLogOut size={18} />
                  <span className="hidden sm:inline">Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 relative overflow-hidden">
            <Image
              src="/tricolor.png"
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Profile Info */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="-mt-16 mb-4 flex flex-col items-center sm:items-start">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
                  {isSaving && !isSigningOut ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <img
                      // The image source is now the preview OR the saved profile avatar
                      src={imagePreview || profile.avatar}
                      alt={`${profile.name}'s profile picture`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/logo.png';
                      }}
                    />
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 mt-4">
                  <label className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow">
                    <FiCamera size={16} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isSaving}
                    />
                  </label>
                  {profile.avatar !== (session?.user?.image || "/logo.png") && !imagePreview && (
                    <button
                      onClick={handleDeleteImage}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete custom image"
                      disabled={isSaving}
                    >
                      <FiX size={16} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow"
                >
                  <FiEdit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiUser size={18} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiMail size={18} />
                  Email Address
                </label>
                <p className="text-lg text-gray-900">{profile.email}</p>
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-700">{profile.bio}</p>
                )}
              </div>

              {/* Joined Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar size={18} />
                  Member Since
                </label>
                <p className="text-lg text-gray-900">{profile.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{profile.stats?.totalChats || 0}</div>
            <div className="text-sm text-gray-600">Total Chats</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{profile.stats?.imagesAnalyzed || 0}</div>
            <div className="text-sm text-gray-600">Images Analyzed</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{profile.stats?.totalMessages || 0}</div>
            <div className="text-sm text-gray-600">Messages Sent</div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            Bharat AI v1.0.0 •<br></br> Made with ❤️ by{" "}
            <a 
              href="https://sagarguptaportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sagar Gupta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}