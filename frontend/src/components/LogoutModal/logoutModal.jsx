import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserAuth } from "../../Context/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

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
