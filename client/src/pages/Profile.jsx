import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase.js";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  signOut,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Profile = () => {

  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const [updateScuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      });
      const res = await uploadTask;
      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      if (downloadUrl) {
        setFormData({ ...formData, profilePicture: downloadUrl });
      }
    } catch (error) {
      setImageError(true);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(
        `/api/v1/user/update/${currentUser.rest._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        return;
      } else {
        dispatch(updateUserFailure(data));
        toast.error(data.message);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.log("Error while updating user : ", error);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(
        `/api/v1/user/delete/${currentUser.rest._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        dispatch(deleteUserSuccess(data));
        setUpdateSuccess(true);
        return;
      } else {
        dispatch(deleteUserFailure(data));
        toast.error(data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      console.log("Error while deleting user : ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/v1/auth/signout");
      dispatch(signOut());
      toast.success("Signed out successfully");
    } catch (error) {
      console.log("Error while signing out : ", error);
    }
  };
  return (
    <Layout>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={
              formData.profilePicture ||
              (currentUser.rest && currentUser.rest.profilePicture)
            }
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
            onClick={() => fileRef.current.click()}
          />
          <p className="text-sm self-center">
            {imageError ? (
              <span className="text-red-700">
                Error while uploading image (file size must be 2 MB )
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className="text-slate-700">{`Uploading image : ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className="text-green-700">
                Image uploaded successfully
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            defaultValue={currentUser.rest && currentUser.rest.username}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleInputChange}
          />
          <input
            defaultValue={currentUser.rest && currentUser.rest.email}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleInputChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDelete} className="text-red-700 cursor-pointer">
            Delete Account
          </span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            Sign Out
          </span>
        </div>
        {updateScuccess && (
          <p className="text-green-700 mt-5">Profile updated successfully</p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
