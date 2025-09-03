import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import jsQR from "jsqr";

export default function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  // Start the camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      // Clean up when component unmounts
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("לא ניתן לגשת למצלמה. אנא ודא שיש לך מצלמה פעילה ושהענקת הרשאות גישה.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for QR code detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Attempt to detect QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          console.log("QR code detected:", code.data);
          
          // Stop scanning and camera
          clearInterval(scanInterval);
          stopCamera();
          
          // Call the onScan callback with the QR code data
          onScan(code.data);
        }
      }
    }, 100);

    // Clean up interval when component unmounts or scanning stops
    return () => clearInterval(scanInterval);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">סריקת קוד QR</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : null}
          
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full opacity-0"
            />
            
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-blue-500 w-2/3 h-2/3 rounded-lg animate-pulse"></div>
              </div>
            )}
            
            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <Button 
                  onClick={startCamera}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  הפעל מצלמה
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-center text-gray-600 text-sm">
            <p>מקם את קוד ה-QR במרכז המסך לסריקה אוטומטית</p>
          </div>
        </div>
      </div>
    </div>
  );
}
