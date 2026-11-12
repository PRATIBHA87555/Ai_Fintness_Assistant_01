FitSaathi - AI fitness website

HOW TO USE
1. Extract this ZIP.
2. Double-click index.html, then press 'Build my plan' (opens in your browser). Internet is needed once for fonts.

FOLDER
index.html     - home page
plan.html      - questions + personal plan page
css/plan.css   - styles for the plan page
js/plan.js     - questions, calculations, workout and meal plan
css/style.css  - all colors, fonts, layout (change colors at the top in :root)
js/app.js      - posture demo, health filter, demo videos
videos/        - put your MP4 demo videos here

ADD DEMO VIDEOS
Open js/app.js, find "const demos", and write the video path as the last value, e.g. "videos/squat.mp4".

PUT ONLINE (free)
Upload the whole folder to Netlify Drop (app.netlify.com/drop), GitHub Pages or Vercel.

NOTE
Posture check here is a demo with sliders. Real camera detection needs MediaPipe Pose.
This app gives fitness guidance, not medical advice.

NEW
js/coach.js     - camera posture coach for squat, lunge, push-up, plank, glute bridge and posture check
js/posture.js   - home page card that opens the camera coach
js/demoanim.js  - animated demos, so exercises work even without MP4 videos.
js/assistant.js - "Ask AI" chat (English + Hinglish). Set window.FS_AI_URL to your own backend to use a real LLM.

V4: every exercise has a Video and Camera button (plan page + home page demos).
js/exdemo.js - demo dialog. Add videos/<exercise-name>.mp4 (names listed in videos/README.txt); otherwise animation + YouTube link is shown.
V5: light-blue theme, dark mode toggle (js/theme.js), new fonts, polished UI.
V6: paste YouTube links in js/videos.js to play them inside the demo popup.
V7: js/tracker.js - Mark done, calories burned (MET x weight x time), live dashboard, mobile tab bar.
V8: talking camera coach (rep count, form tips, plank timer, English/Hinglish voice); camera reps + calories saved to Progress.
V9: AI coach chat (netlify/functions/coach.js) + full-screen camera.
AI setup: deploy with Netlify via GitHub or "netlify deploy" (drag-and-drop zip does not run functions). Add env var ANTHROPIC_API_KEY. Without it the chat falls back to the offline answers.
V10: free AI option - set GEMINI_API_KEY (Google AI Studio, no billing) in Netlify. Works without any key too (offline answers).
