import { useEffect, useRef, useState } from "react";

const COMPLAINT_DESCRIPTIONS = {
  Garbage:
    "Garbage accumulation has been detected in the society area. The waste appears unattended and may create hygiene risks. Cleaning and proper disposal are required.",
  "Street Light":
    "A street light issue has been detected. The area may have poor visibility at night and requires electrical inspection or repair.",
  Road:
    "A road maintenance issue has been detected. The surface appears damaged and may require repair for safe movement.",
  Violence:
    "A violence or security issue has been detected in the society area. Immediate review and response are required.",
};

export default function SocietyLevelComplaints() {
  const [location, setLocation] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issueDetected, setIssueDetected] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [selectedType, setSelectedType] = useState("Auto");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (cameraOpen && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  const enableLocation = () => {
    if (submitted) return;

    if (!navigator.geolocation) {
      alert("Location is not supported by this browser");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const fallbackLocation = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        setCoordinates({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setLocation(data.display_name || fallbackLocation);
        } catch {
          setLocation(fallbackLocation);
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        alert("Please enable your device location");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const analyzeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    setIsAnalyzing(true);
    setIssueDetected(false);
    setPrediction(null);

    try {
      const res = await fetch("http://localhost:5000/api/model/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "AI prediction failed");
        return;
      }

      setPrediction(data.prediction);
      setSelectedType("Auto");
      setIssueDetected(true);
    } catch {
      alert("AI server error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e) => {
    if (submitted) return;
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setImageName(file.name);
    analyzeImage(file);
  };

  const startCamera = async () => {
    if (submitted || cameraBusy) return;

    setCameraError("");
    setCameraBusy(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      streamRef.current = stream;
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 300);
    } catch (err) {
      setCameraError("Camera access is not available. Please allow permission or use Upload Image.");
    } finally {
      setCameraBusy(false);
    }
  };

  const closeCamera = () => {
    setCameraOpen(false);
    setCameraError("");

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const captureFromCamera = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      alert("Camera is not ready yet");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `society-camera-${Date.now()}.png`, { type: "image/png" });
        const previewUrl = URL.createObjectURL(file);

        setImage(previewUrl);
        setImageFile(file);
        setImageName(file.name);
        analyzeImage(file);
        closeCamera();
      },
      "image/png",
      0.95
    );
  };

  const resetImage = () => {
    if (submitted) return;
    closeCamera();
    setImage(null);
    setImageFile(null);
    setImageName("");
    setIssueDetected(false);
    setIsAnalyzing(false);
    setPrediction(null);
    setSelectedType("Auto");
  };

  const submitComplaint = async () => {
    const finalLocation = manualLocation || location;
    const finalType = selectedType === "Auto" ? prediction?.complaintType : selectedType;
    const finalDescription = COMPLAINT_DESCRIPTIONS[finalType] || prediction?.description || "Society complaint submitted for review.";

    if (!finalLocation || !imageFile || !issueDetected || !finalType) {
      alert("Please add location and upload an image first");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("complaintType", finalType);
    formData.append("description", finalDescription);
    formData.append("location", finalLocation);
    formData.append("imageName", imageName);
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/society-complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Could not submit complaint");
        return;
      }

      setLocation("");
      setManualLocation("");
      setCoordinates(null);
      setImage(null);
      setImageFile(null);
      setImageName("");
      setIsAnalyzing(false);
      setIssueDetected(false);
      setPrediction(null);
      setSelectedType("Auto");
      setSubmitted(false);
      setUploadKey((key) => key + 1);
    } catch {
      alert("Could not submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h1>Submit Society Complaint</h1>
          <p>Capture an issue, detect location, and let the AI model generate the complaint category and description.</p>
        </section>

        <div className="s2f-grid two">
          <section className="s2f-card">
            <h3>Location</h3>
            <button className="s2f-btn primary" onClick={enableLocation} disabled={submitted || detectingLocation}>
              {detectingLocation ? "Detecting..." : "Detect Device Location"}
            </button>

            {location && <p className="s2f-note">{location}</p>}

            <div className="s2f-divider">or</div>

            <input
              className="s2f-input"
              type="text"
              placeholder="Enter location manually"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              disabled={submitted}
            />

            {coordinates && (
              <iframe
                title="Society complaint location map"
                className="s2f-map"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.004},${coordinates.lat - 0.004},${coordinates.lng + 0.004},${coordinates.lat + 0.004}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
              />
            )}
          </section>

          <section className="s2f-card">
            <h3>AI Image Processing</h3>
            {!image ? (
              <div className="s2f-actions aligned">
                <label className="s2f-btn primary" style={{ display: "inline-flex", justifyContent: "center" }}>
                  Upload Image
                  <input
                    key={`upload-${uploadKey}`}
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={submitted}
                    onChange={handleImageUpload}
                  />
                </label>
                <button className="s2f-btn primary" type="button" onClick={startCamera} disabled={submitted || cameraBusy}>
                  {cameraBusy ? "Opening Camera..." : "Open Camera"}
                </button>
              </div>
            ) : (
              <>
                <img src={image} alt="complaint" className="s2f-preview" />
                <button className="s2f-btn subtle" onClick={resetImage} disabled={submitted}>
                  Retry / Change Image
                </button>
              </>
            )}

            {cameraOpen && (
              <div className="s2f-camera">
                <video ref={videoRef} className="s2f-camera-video" autoPlay playsInline muted />
                <div className="s2f-actions aligned">
                  <button className="s2f-btn primary" type="button" onClick={captureFromCamera}>
                    Capture Photo
                  </button>
                  <button className="s2f-btn subtle" type="button" onClick={closeCamera}>
                    Close Camera
                  </button>
                </div>
                {cameraError && <p className="s2f-alert danger">{cameraError}</p>}
              </div>
            )}

            {isAnalyzing && <p className="s2f-alert info">AI model is analyzing the image...</p>}

            {issueDetected && prediction && (
              <div className="s2f-result">
                <p className="s2f-success">Issue Detected: {prediction.complaintType}</p>
                <p>{prediction.description}</p>
                <label className="s2f-label" style={{ marginTop: "10px", display: "block" }}>
                  Complaint Type
                </label>
                <select
                  className="s2f-input"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="Auto">Auto detected</option>
                  <option value="Violence">Violence / Security</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Road">Road</option>
                  <option value="Street Light">Street Light</option>
                </select>
                <button className="s2f-btn primary" disabled={submitted || submitting} onClick={submitComplaint}>
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}