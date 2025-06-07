import React from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserAuth } from "../../Context/AuthContext";


const LogoutModal = React.memo(function LogoutModal({
  OpenLogoutModal,
  handleClose,
}) {
  const { SignOut } = UserAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await SignOut();
    navigate("/");
    toast.success("Logout successfull!");
    handleClose();
    localStorage.removeItem("avatarUrl");
  }

  return (
    <div>
      <Modal
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
        open={OpenLogoutModal}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={OpenLogoutModal}>
          <div className="h-screen flex justify-center items-center">
            <div className="p-6 rounded-2xl shadow-xl w-full max-w-md bg-[#fffefe]">
              <h2 className="text-xl font-semibold border-b border-gray-200 pb-2">
                Confirm Logout
              </h2>
              <p className="mt-4 text-sm">Are you sure you want to log out?</p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
                <button
                  onClick={handleClose}
                  className=" text-white bg-[#2b3333] hover:bg-black px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
});

export default LogoutModal;
