import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Use /TravelIndia basename in production (GitHub Pages), none in development
const basename = process.env.NODE_ENV === 'production' ? '/TravelIndia' : '';

createRoot(document.getElementById("root")).render(
	<BrowserRouter basename={basename}>
		<App />
	</BrowserRouter>
);
