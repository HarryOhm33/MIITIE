import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { FaUserShield, FaUserCheck, FaSearch, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      
      const usersList = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;
        
        // If properties are missing, write them to Firestore to guarantee visibility in the console
        if (data.isAdmin === undefined || data.isSuperAdmin === undefined) {
          const updates = {};
          if (data.isAdmin === undefined) updates.isAdmin = false;
          if (data.isSuperAdmin === undefined) updates.isSuperAdmin = false;
          
          try {
            await updateDoc(doc(db, "users", id), updates);
          } catch (err) {
            console.error(`Failed to backfill user ${id}:`, err);
          }
          
          data.isAdmin = data.isAdmin === undefined ? false : data.isAdmin;
          data.isSuperAdmin = data.isSuperAdmin === undefined ? false : data.isSuperAdmin;
        }
        
        usersList.push({
          id,
          ...data,
        });
      }
      
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    if (updatingUserId) return;
    const isSelf = userId === auth.currentUser?.uid;
    if (isSelf && currentStatus) {
      toast.error("You cannot revoke your own Admin rights to prevent locking yourself out.");
      return;
    }

    try {
      setUpdatingUserId(userId);
      const userRef = doc(db, "users", userId);
      const newStatus = !currentStatus;
      const updates = {
        isAdmin: newStatus,
      };
      if (!newStatus) {
        updates.isSuperAdmin = false;
      }
      await updateDoc(userRef, updates);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isAdmin: newStatus, ...(!newStatus ? { isSuperAdmin: false } : {}) }
            : u
        )
      );
      toast.success(`Admin role updated successfully`);
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleSuperAdmin = async (userId, currentStatus) => {
    if (updatingUserId) return;
    const isSelf = userId === auth.currentUser?.uid;
    if (isSelf) {
      toast.error("You cannot modify your own Super Admin rights to prevent accidental lockout.");
      return;
    }

    try {
      setUpdatingUserId(userId);
      const userRef = doc(db, "users", userId);
      const newStatus = !currentStatus;
      const updates = {
        isSuperAdmin: newStatus,
      };
      if (newStatus) {
        updates.isAdmin = true;
      }
      await updateDoc(userRef, updates);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isSuperAdmin: newStatus, ...(newStatus ? { isAdmin: true } : {}) }
            : u
        )
      );
      toast.success(`Super Admin role updated successfully`);
    } catch (error) {
      console.error("Error updating super admin status:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setUpdatingUserId(deletingUser.id);
      await deleteDoc(doc(db, "users", deletingUser.id));
      toast.success("User deleted successfully");
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setUpdatingUserId(null);
      setDeletingUser(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header card with Search and Count */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Users Authority Center</h3>
          <p className="text-xs text-slate-400 mt-1">Manage platform authorization rights, Admin privileges, and operator keys</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
            />
          </div>
          <span className="shrink-0 text-xs font-bold text-slate-500 bg-slate-100 px-3.5 py-2.5 rounded-xl">
            Total users: {users.length}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingUser(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <FaTrash className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete User Account?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Are you sure you want to permanently delete user <span className="font-semibold text-slate-700">"{deletingUser.name || deletingUser.email}"</span>? This will revoke all database permissions. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setDeletingUser(null)}
                  disabled={updatingUserId !== null}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-bold cursor-pointer bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={updatingUserId !== null}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold cursor-pointer border-0 shadow disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingUserId === deletingUser.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Users Control Table */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Operator / User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                    Role Badges
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                    Admin Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                    Super Admin Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((user) => {
                  const isSelf = user.id === auth.currentUser?.uid;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        <div className="flex flex-col">
                          <span>{user.name || "Anonymous operator"}</span>
                          {isSelf && (
                            <span className="text-[10px] text-amber-600 font-extrabold uppercase mt-0.5 tracking-wider">
                              Current Operator (You)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {user.isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold shadow-sm">
                              <FaUserShield className="w-3.5 h-3.5" />
                              Super Admin
                            </span>
                          ) : user.isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold shadow-sm">
                              <FaUserCheck className="w-3.5 h-3.5" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-400 rounded-full text-xs font-semibold">
                              Regular User
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          disabled={updatingUserId !== null || isSelf}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.isAdmin ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                          title={isSelf ? "Self-modification disabled" : user.isAdmin ? "Revoke Admin Privilege" : "Grant Admin Privilege"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              user.isAdmin ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => handleToggleSuperAdmin(user.id, user.isSuperAdmin)}
                          disabled={updatingUserId !== null || isSelf}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.isSuperAdmin ? 'bg-amber-500' : 'bg-slate-200'
                          }`}
                          title={isSelf ? "Self-modification disabled" : user.isSuperAdmin ? "Revoke Super Admin Privilege" : "Grant Super Admin Privilege"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              user.isSuperAdmin ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={updatingUserId !== null || isSelf}
                          className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isSelf ? "Self-deletion disabled" : "Delete User"}
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          No users found matching your search query.
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
