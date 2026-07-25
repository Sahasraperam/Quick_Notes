import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import api from "../lib/axios";
import toast from "react-hot-toast";
import NotesNotFound from '../components/NotesNotFound';
import { FolderIcon, PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link, useNavigate } from 'react-router';

const groupNotes = (notes) => {
  const groups = {
    Today: [],
    "Previous 30 Days": [],
  };

  const today = new Date();
  const todayStr = today.toDateString();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  notes.forEach((note) => {
    const noteDate = new Date(note.createdAt);
    if (noteDate.toDateString() === todayStr) {
      groups.Today.push(note);
    } else if (noteDate > thirtyDaysAgo) {
      groups["Previous 30 Days"].push(note);
    } else {
      const month = noteDate.toLocaleDateString("en-US", { month: "long" });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(note);
    }
  });

  if (groups.Today.length === 0) delete groups.Today;
  if (groups["Previous 30 Days"].length === 0) delete groups["Previous 30 Days"];

  return groups;
};

const formatItemDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
};

const formatMainDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
};

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        if (res.data.length > 0) {
          setSelectedNote(res.data[0]);
        }
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter(note => note._id !== id));
      if (selectedNote?._id === id) {
        setSelectedNote(null);
      }
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const groupedNotes = groupNotes(notes);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base-100">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      {!isRateLimited && (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-base-200 border-r border-base-content/50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {loading && <div className="p-4 text-center text-primary">Loading notes...</div>}
            
            {!loading && Object.entries(groupedNotes).map(([groupName, groupNotes]) => (
              <div key={groupName} className="mb-2">
                <h3 className="px-4 py-2 text-sm font-bold text-base-content/70">{groupName}</h3>
                <ul>
                  {groupNotes.map((note) => (
                    <li key={note._id}>
                      <button
                        onClick={() => setSelectedNote(note)}
                        className={`w-full text-left px-4 py-3 border-b border-base-content/5 transition-colors duration-200 ${
                          selectedNote?._id === note._id
                            ? "bg-primary text-primary-content"
                            : "hover:bg-base-300 text-base-content"
                        }`}
                      >
                        <div className="font-bold truncate">{note.title}</div>
                        <div className={`text-sm mt-1 flex items-center gap-2 truncate ${
                          selectedNote?._id === note._id ? "text-primary-content/80" : "text-base-content/60"
                        }`}>
                          <span>{formatItemDate(note.createdAt)}</span>
                          <span className="truncate">{note.content || "No additional text"}</span>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                           selectedNote?._id === note._id ? "text-primary-content/80" : "text-base-content/50"
                        }`}>
                          <FolderIcon className="size-3" />
                          <span>Notes</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </div>

            {/* User Profile Footer */}
            {user && (
              <div className="p-4 border-t border-base-content/50 bg-base-200 mt-auto shrink-0">
                <div className="dropdown dropdown-top w-full">
                  <div tabIndex={0} role="button" className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-base-300 transition-colors">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-10">
                        <span className="text-lg">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex-1 text-left truncate">
                      <div className="font-bold text-sm truncate">{user.username}</div>
                      <div className="text-xs text-base-content/60 truncate">{user.email}</div>
                    </div>
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mb-2">
                    <li>
                      <button onClick={handleLogout} className="text-error font-semibold">Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-base-100 overflow-y-auto relative p-8">
            {notes.length === 0 && !loading ? (
              <NotesNotFound />
            ) : selectedNote ? (
              <div className="max-w-3xl mx-auto">
                <div className="text-center text-sm text-base-content/50 mb-8">
                  {formatMainDate(selectedNote.createdAt)}
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl font-bold text-base-content">{selectedNote.title}</h1>
                  <div className="flex gap-2">
                    <Link to={`/note/${selectedNote._id}`} className="btn btn-ghost btn-sm">
                      <PenSquareIcon className="size-4" />
                      Edit
                    </Link>
                    <button 
                      onClick={(e) => handleDelete(e, selectedNote._id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <Trash2Icon className="size-4" />
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-base-content max-w-none whitespace-pre-wrap">
                  {selectedNote.content}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-base-content/50">
                Select a note to view its content
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
