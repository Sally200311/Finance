
# SmartFinance AI - 部署指南

本專案使用 Vite, Firebase 與 Google Gemini API 開發。以下是完整的部署步驟：

## 1. Firebase 設定 (資料庫與驗證)
1. 前往 [Firebase Console](https://console.firebase.google.com/)。
2. 點擊「新增專案」，輸入專案名稱。
3. 在左側選單中找到 **Authentication (驗證)**，點擊「開始使用」，並啟用「電子郵件/密碼」登入方式。
4. 在左側選單中找到 **Firestore Database**，點擊「建立資料庫」，選擇「生產模式」，並選擇伺服器地點。
5. 前往「專案設定」(齒輪圖示)，在「一般」標籤下方找到「您的應用程式」，點擊「</>」(網頁圖示) 進行註冊。
6. 複製出現的 `firebaseConfig` 物件內容 (JSON 格式)，稍後會用到。

## 2. Google Gemini API 設定 (AI 功能)
1. 前往 [Google AI Studio](https://aistudio.google.com/)。
2. 點擊左側的 "Get API key"。
3. 點擊 "Create API key in new project" 並複製這組 API Key。

## 3. GitHub 設定 (自動化部署)
1. 在 GitHub 儲存庫頁面，點擊 **Settings** 標籤。
2. 在左側選單找到 **Secrets and variables** -> **Actions**。
3. 點擊 **New repository secret**，新增以下兩個 Secret：
   - `API_KEY`: 貼上您的 Gemini API Key。
   - `FIREBASE_CONFIG`: 貼上您的 Firebase Config (需為 JSON 字串格式)。
     *格式範例：*
     ```json
     {
       "apiKey": "...",
       "authDomain": "...",
       "projectId": "...",
       "storageBucket": "...",
       "messagingSenderId": "...",
       "appId": "..."
     }
     ```
4. 點擊 **Settings** -> **Pages**。
5. 在 **Build and deployment** 下方的 **Source**，選擇 "GitHub Actions"。

## 4. 開始部署
1. 將代碼推送 (Push) 到 GitHub 的 `main` 分支。
2. 前往 GitHub 的 **Actions** 標籤查看部署進度。
3. 部署完成後，您的網頁將在 `https://<您的帳號>.github.io/<專案名稱>/` 上線。

---

*注意：若您在本地運行，請建立 `.env` 檔案並填入對應的變數，或者系統會自動進入「離線展示模式」。*
