import { useEffect, useMemo, useRef, useState } from "react";
import { users as initialUsers } from "../data/family";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle2,
  Search,
  Trash2,
  UploadCloud,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Navbar from "../layouts/Navbar";

const STORAGE_KEY = "pushkaralu_family_members";

const DEFAULT_FORM_DATA = {
  name: "",
  relation: "",
  age: "",
  gender: "",
  idCardNumber: "",
  phone: "",
};

function FamilyMembers({ onBack }) {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return initialUsers;
      }
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return initialUsers;
    } catch {
      return initialUsers;
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");

  const [activeView, setActiveView] = useState("list");
  const [cameraMode, setCameraMode] = useState("environment");
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState("");
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeView === "list") {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      });
    }
  }, [activeView]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCameraStream = async (mode = "environment") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported in this browser.");
      return;
    }

    try {
      setCameraError("");
      setCameraMode(mode);
      setActiveView("camera");
      let stream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError("Unable to access camera. Please allow permission and try again.");
      setActiveView("list");
    }
  };

  const handleCameraScan = () => {
    setCapturedImage("");
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    startCameraStream("environment");
  };

  const handleSelfieCam = () => {
    setCapturedImage("");
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    startCameraStream("user");
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Unable to capture the photo. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg", 0.85);

    stopCameraStream();
    setCapturedImage(imageData);
    setActiveView("form");
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setActiveView("list");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    if (!e.target.files?.[0]) {
      return;
    }

    const selectedFile = e.target.files[0];
    e.target.value = "";

    setIsProcessing(true);
    setProcessingText(`Uploading ${selectedFile.name}...`);

    try {
      let filePreview = "";
      if (selectedFile.type.startsWith("image/")) {
        const result = await readFileAsDataUrl(selectedFile);
        if (typeof result === "string") {
          filePreview = result;
        }
      }

      setCapturedImage(filePreview);
      setFormData((prev) => ({
        ...prev,
        name: selectedFile.name.split(".")[0].replace(/[_-]/g, " "),
      }));
      setFormErrors({});
      setActiveView("form");
    } catch {
      setCameraError("Unable to process selected file.");
    } finally {
      setIsProcessing(false);
      setProcessingText("");
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.relation.trim()) {
      errors.relation = "Relation is required";
    }
    if (!formData.age) {
      errors.age = "Age is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    return errors;
  };

  const handleSubmitMember = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    setProcessingText("Saving member details...");

    const newMember = {
      id: String(Date.now()),
      name: formData.name.trim(),
      relation: formData.relation.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      idCardNumber: formData.idCardNumber.trim() || "Not Provided",
      phone: formData.phone.trim() || formData.idCardNumber.trim() || "Not Provided",
      avatar:
        capturedImage ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    };

    setMembers((prev) => [newMember, ...prev]);

    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setCapturedImage("");
    setActiveView("list");

    setIsProcessing(false);
    setProcessingText("");
  };

  const handleCancelForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setCapturedImage("");
    setActiveView("list");
  };

  const handleBackToFamilyPage = () => {
    stopCameraStream();
    setActiveView("list");
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [members, searchTerm]);

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col justify-between relative shadow-2xl border-x border-gray-200 select-none pb-8">
      <Navbar showBack={true} onBack={onBack} />

      <div ref={scrollContainerRef} className="flex-1 flex flex-col px-4 pt-4 pb-20 overflow-y-auto">
        <div className="rounded-3xl bg-gradient-to-br from-brand-950 to-brand-800 text-white p-4 border border-brand-800 shadow-lg shadow-brand-950/20 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold tracking-wide">Family Registry</h2>
              <p className="text-[10px] text-brand-100 font-semibold mt-1 uppercase tracking-wider">
                Classic Family Registration
              </p>
            </div>
            <span className="bg-white/10 border border-white/20 text-[10px] font-black px-2.5 py-1 rounded-full">
              {members.length} Members
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-white/10 border border-white/15 p-2.5">
              <p className="text-[8.5px] uppercase tracking-wider text-brand-100 font-bold">Registered</p>
              <p className="text-sm font-black mt-1">{members.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/15 p-2.5">
              <p className="text-[8.5px] uppercase tracking-wider text-brand-100 font-bold">Uploads</p>
              <p className="text-sm font-black mt-1">{members.length}</p>
            </div>
          </div>
        </div>

        {cameraError && (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
            {cameraError}
          </div>
        )}

        {activeView === "camera" && (
          <section className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {cameraMode === "user" ? "Selfie Capture" : "Camera Capture"}
              </h3>
              <button
                onClick={handleCloseCamera}
                className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500"
                aria-label="Close camera"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 aspect-[3/4] flex items-center justify-center">
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleCloseCamera}
                className="h-11 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-[11px] font-black"
              >
                Cancel
              </button>
              <button
                onClick={handleCapturePhoto}
                className="h-11 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-[11px] font-black flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                Capture
              </button>
            </div>
          </section>
        )}

        {activeView === "form" && (
          <section className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Member Details</h3>
              <button
                onClick={handleCancelForm}
                className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500"
                aria-label="Close details form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured member"
                className="w-full h-44 object-cover rounded-2xl border border-slate-200"
              />
            ) : (
              <div className="w-full h-44 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                <CameraOff className="w-6 h-6" />
              </div>
            )}

            <form onSubmit={handleSubmitMember} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="member-name" className="text-[11px] font-bold text-slate-700">
                  Full Name
                </label>
                <input
                  id="member-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                  placeholder="Enter full name"
                />
                {formErrors.name && <p className="text-[10px] font-semibold text-rose-600">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="member-relation" className="text-[11px] font-bold text-slate-700">
                    Relation
                  </label>
                  <input
                    id="member-relation"
                    name="relation"
                    value={formData.relation}
                    onChange={handleFormChange}
                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                    placeholder="e.g. Brother"
                  />
                  {formErrors.relation && (
                    <p className="text-[10px] font-semibold text-rose-600">{formErrors.relation}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="member-age" className="text-[11px] font-bold text-slate-700">
                    Age
                  </label>
                  <input
                    id="member-age"
                    name="age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={handleFormChange}
                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                    placeholder="Age"
                  />
                  {formErrors.age && <p className="text-[10px] font-semibold text-rose-600">{formErrors.age}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="member-gender" className="text-[11px] font-bold text-slate-700">
                  Gender
                </label>
                <select
                  id="member-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && <p className="text-[10px] font-semibold text-rose-600">{formErrors.gender}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="member-id" className="text-[11px] font-bold text-slate-700">
                  ID Number (Optional)
                </label>
                <input
                  id="member-id"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleFormChange}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                  placeholder="Enter ID number"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="member-phone" className="text-[11px] font-bold text-slate-700">
                  Contact Number (Optional)
                </label>
                <input
                  id="member-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-[11px] font-black"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="h-11 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-[11px] font-black flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </form>
          </section>
        )}

        {activeView === "list" && (
          <section className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Add Member</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1.5">
            Use camera scanner or upload a file to register family details.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">

            <button
              onClick={handleSelfieCam}
              disabled={isProcessing}
              className="rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-3 py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-[0.98]"
              aria-label="Open selfie camera"
            >
              <UserRound className="w-5 h-5" />
              <span className="text-[11px] font-black">Selfie Cam</span>
            </button>

            <button
              onClick={handleUploadClick}
              disabled={isProcessing}
              className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 px-3 py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-[0.98]"
            >
              <UploadCloud className="w-5 h-5 text-slate-600" />
              <span className="text-[11px] font-black text-slate-700">Upload File</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
          />

          {isProcessing && (
            <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></div>
              <p className="text-[10px] font-bold text-brand-700">{processingText}</p>
            </div>
          )}
          </section>
        )}

        <section className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Family Details</h3>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">
              <UsersRound className="w-3 h-3" />
              {filteredMembers.length} showing
            </div>
          </div>

          <div className="mt-3 relative">
            <label htmlFor="member-search" className="sr-only">
              Search family members
            </label>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="member-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member by name"
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-black text-slate-800">{member.name}</h3>
                    </div>
                    <p className="text-[9.5px] font-bold text-slate-500 mt-1">
                      {member.relation || "Family Member"}
                    </p>
                    <p className="text-[9.5px] font-bold text-slate-400 mt-0.5">
                      {member.gender} • {member.age} Yrs
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      ID: {member.idCardNumber || "Not Provided"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Phone: {member.phone || "Not Provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 active:scale-95 transition-all flex items-center justify-center text-slate-400"
                    aria-label="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center shadow-sm">
                <AlertCircle className="w-10 h-10 text-slate-300 mb-2.5" />
                <h3 className="text-xs font-black text-slate-700">No matching family details</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-[200px]">
                  Add a new member using cam scanner or file upload.
                </p>
              </div>
            )}
          </div>
        </section>

        {activeView !== "list" && (
          <button
            onClick={handleBackToFamilyPage}
            className="mt-4 h-11 rounded-2xl bg-slate-900 text-white text-[11px] font-black flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Family Page
          </button>
        )}
      </div>
    </div>
  );
}

export default FamilyMembers;
