import firebase from "firebase/compat/app";
import { jwtDecode } from "jwt-decode";
import "firebase/storage";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

export const convertTo12Hour = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
};

export const handleOpen = (startTime, endTime) => {
  const now = new Date();

  const startHours = parseInt(startTime.split(":")[0], 10);
  const startMinutes = parseInt(startTime.split(":")[1], 10);
  const start = new Date(now.setHours(startHours, startMinutes, 0, 0));

  const endHours = parseInt(endTime.split(":")[0], 10);
  const endMinutes = parseInt(endTime.split(":")[1], 10);
  const end = new Date(now.setHours(endHours, endMinutes, 0, 0));

  return now >= start && now <= end;
};

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app;
const storage = getStorage(app);

export const getImageUrl = async (fileName) => {
  try {
    const storageRef = ref(storage, fileName);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error fetching download URL:", error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const getBackendUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://yum-hub-683741ba0e1d.herokuapp.com"
    : "http://localhost:4000";
};

export function formatTimestamp(timestamp) {
  // Ensure the timestamp is a number
  const timestampNum = Number(timestamp);

  // Check if timestamp is valid
  if (isNaN(timestampNum) || timestampNum <= 0) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid timestamp";
  }

  const dateObj = new Date(timestampNum);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid Date object:", dateObj);
    return "Invalid Date";
  }

  // Format the date
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" });
  const formattedDate = `${day} ${month}.`;

  // Format the time
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const result = `${formattedDate} ${formattedTime}`;

  console.log(result);
  return result;
}
