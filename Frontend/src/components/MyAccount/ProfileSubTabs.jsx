import React from 'react';
import ProfileEditForm from './ProfileEditForm';
import PasswordChangeForm from './PasswordChangeForm';

const ProfileSubTabs = ({
  profileSubTab,
  setProfileSubTab,
  editData,
  setEditData,
  onSubmitProfile,
  isSavingProfile,
  passwordData,
  setPasswordData,
  onSubmitPassword,
  isSavingPassword,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200/50">
        <button
          onClick={() => setProfileSubTab('edit')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
            profileSubTab === 'edit'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Hồ sơ
        </button>
        <button
          onClick={() => setProfileSubTab('password')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
            profileSubTab === 'password'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Mật khẩu
        </button>
      </div>

      <div className="mt-10">
        {profileSubTab === 'edit' ? (
          <ProfileEditForm
            editData={editData}
            setEditData={setEditData}
            onSubmit={onSubmitProfile}
            isSaving={isSavingProfile}
          />
        ) : (
          <PasswordChangeForm
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onSubmit={onSubmitPassword}
            isSaving={isSavingPassword}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSubTabs;
