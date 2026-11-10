using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;

namespace PreZifyApp
{
    public class Program
    {
        private static HttpListener _listener;
        private static Thread _serverThread;
        private static bool _isRunning = true;
        private static int _port = 5000;
        private static string _appDir = "";
        private static string _frontendDir = "";
        private static string _backendDir = "";
        private static NotifyIcon _trayIcon;
        private static Process _browserProcess;

        [STAThread]
        public static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Determine application directory
            _appDir = AppDomain.CurrentDomain.BaseDirectory;
            _frontendDir = Path.Combine(_appDir, "frontend");
            if (!Directory.Exists(_frontendDir))
            {
                _frontendDir = _appDir;
            }
            _backendDir = Path.Combine(_appDir, "backend");

            // Find an open port
            _port = GetAvailablePort(5000);

            // Start Embedded Web & Audio Streaming Server
            StartHttpServer();

            // Set up System Tray icon
            SetupTrayIcon();

            // Launch Desktop App Window
            LaunchDesktopWindow();

            // Run Windows Forms message loop
            Application.Run();
        }

        private static int GetAvailablePort(int startingPort)
        {
            for (int p = startingPort; p < startingPort + 100; p++)
            {
                try
                {
                    TcpListener tcpListener = new TcpListener(IPAddress.Loopback, p);
                    tcpListener.Start();
                    tcpListener.Stop();
                    return p;
                }
                catch
                {
                    // Port in use, try next
                }
            }
            return 5000;
        }

        private static void StartHttpServer()
        {
            try
            {
                _listener = new HttpListener();
                _listener.Prefixes.Add("http://127.0.0.1:" + _port + "/");
                _listener.Prefixes.Add("http://localhost:" + _port + "/");
                _listener.Start();

                _serverThread = new Thread(ServerWorker)
                {
                    IsBackground = true
                };
                _serverThread.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Could not start PreZify local audio server:\n" + ex.Message, "PreZify Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void ServerWorker()
        {
            while (_isRunning && _listener != null && _listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = _listener.GetContext();
                    ThreadPool.QueueUserWorkItem(ProcessRequest, context);
                }
                catch
                {
                    if (!_isRunning) break;
                }
            }
        }

        private static void ProcessRequest(object state)
        {
            HttpListenerContext context = (HttpListenerContext)state;
            HttpListenerRequest request = context.Request;
            HttpListenerResponse response = context.Response;

            // CORS headers
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Range");
            response.Headers.Add("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length");

            if (request.HttpMethod == "OPTIONS")
            {
                response.StatusCode = 204;
                response.Close();
                return;
            }

            try
            {
                string rawPath = request.Url.AbsolutePath;

                // Handle Root & Index
                if (rawPath == "/" || rawPath == "/index.html")
                {
                    ServeFile(response, Path.Combine(_frontendDir, "index.html"), "text/html; charset=UTF-8");
                    return;
                }

                // Handle REST API: /api/songs
                if (rawPath == "/api/songs")
                {
                    string songsJson = Path.Combine(_backendDir, "data", "songs.json");
                    if (File.Exists(songsJson))
                    {
                        ServeFile(response, songsJson, "application/json; charset=UTF-8");
                    }
                    else
                    {
                        ServeJson(response, "{\"success\":true,\"data\":[]}");
                    }
                    return;
                }

                // Handle REST API: /api/playlists
                if (rawPath == "/api/playlists")
                {
                    string plJson = Path.Combine(_backendDir, "data", "playlists.json");
                    if (File.Exists(plJson))
                    {
                        ServeFile(response, plJson, "application/json; charset=UTF-8");
                    }
                    else
                    {
                        ServeJson(response, "{\"success\":true,\"data\":[]}");
                    }
                    return;
                }

                // Handle REST API: /api/artists
                if (rawPath == "/api/artists")
                {
                    string artJson = Path.Combine(_backendDir, "data", "artists.json");
                    if (File.Exists(artJson))
                    {
                        ServeFile(response, artJson, "application/json; charset=UTF-8");
                    }
                    else
                    {
                        ServeJson(response, "{\"success\":true,\"data\":[]}");
                    }
                    return;
                }

                // Handle Audio Stream with HTTP 206 Partial Content (Fast Seeking)
                if (rawPath.Contains("/api/songs/") && rawPath.EndsWith("/stream"))
                {
                    string[] parts = rawPath.Split('/');
                    string songId = parts[parts.Length - 2];
                    string audioPath = Path.Combine(_frontendDir, "songs", songId.Replace("track-", "song") + ".mp3");
                    if (!File.Exists(audioPath))
                    {
                        audioPath = Path.Combine(_appDir, "songs", songId.Replace("track-", "song") + ".mp3");
                    }
                    if (File.Exists(audioPath))
                    {
                        StreamAudio(request, response, audioPath);
                        return;
                    }
                }

                // Handle Static Files (CSS, JS, Images, Songs)
                string relPath = rawPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                string filePath = Path.Combine(_frontendDir, relPath);
                if (!File.Exists(filePath))
                {
                    filePath = Path.Combine(_appDir, relPath);
                }

                if (File.Exists(filePath))
                {
                    string ext = Path.GetExtension(filePath).ToLower();
                    if (ext == ".mp3")
                    {
                        StreamAudio(request, response, filePath);
                    }
                    else
                    {
                        ServeFile(response, filePath, GetMimeType(ext));
                    }
                    return;
                }

                // 404 Not Found
                response.StatusCode = 404;
                byte[] notFoundBytes = Encoding.UTF8.GetBytes("404 - PreZify Resource Not Found");
                response.ContentType = "text/plain";
                response.OutputStream.Write(notFoundBytes, 0, notFoundBytes.Length);
                response.Close();
            }
            catch
            {
                try
                {
                    response.StatusCode = 500;
                    response.Close();
                }
                catch { }
            }
        }

        private static void ServeFile(HttpListenerResponse response, string filePath, string contentType)
        {
            byte[] fileBytes = File.ReadAllBytes(filePath);
            response.ContentType = contentType;
            response.ContentLength64 = fileBytes.Length;
            response.StatusCode = 200;
            response.OutputStream.Write(fileBytes, 0, fileBytes.Length);
            response.Close();
        }

        private static void ServeJson(HttpListenerResponse response, string json)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(json);
            response.ContentType = "application/json; charset=UTF-8";
            response.ContentLength64 = bytes.Length;
            response.StatusCode = 200;
            response.OutputStream.Write(bytes, 0, bytes.Length);
            response.Close();
        }

        private static void StreamAudio(HttpListenerRequest request, HttpListenerResponse response, string audioPath)
        {
            FileInfo fi = new FileInfo(audioPath);
            long totalLength = fi.Length;
            string rangeHeader = request.Headers["Range"];

            response.ContentType = "audio/mpeg";
            response.Headers.Add("Accept-Ranges", "bytes");

            if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes="))
            {
                string rangeSpan = rangeHeader.Substring(6);
                string[] parts = rangeSpan.Split('-');
                long start = 0;
                long.TryParse(parts[0], out start);
                long end = totalLength - 1;
                if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1]))
                {
                    long.TryParse(parts[1], out end);
                }

                if (start >= totalLength)
                {
                    response.StatusCode = 416; // Requested range not satisfiable
                    response.Headers.Add("Content-Range", "bytes */" + totalLength);
                    response.Close();
                    return;
                }

                long count = end - start + 1;
                response.StatusCode = 206; // Partial Content
                response.Headers.Add("Content-Range", string.Format("bytes {0}-{1}/{2}", start, end, totalLength));
                response.ContentLength64 = count;

                using (FileStream fs = new FileStream(audioPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    fs.Seek(start, SeekOrigin.Begin);
                    byte[] buffer = new byte[64 * 1024];
                    long bytesLeft = count;
                    while (bytesLeft > 0)
                    {
                        int read = fs.Read(buffer, 0, (int)Math.Min(buffer.Length, bytesLeft));
                        if (read <= 0) break;
                        response.OutputStream.Write(buffer, 0, read);
                        bytesLeft -= read;
                    }
                }
            }
            else
            {
                response.StatusCode = 200;
                response.ContentLength64 = totalLength;
                using (FileStream fs = new FileStream(audioPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    fs.CopyTo(response.OutputStream);
                }
            }
            response.Close();
        }

        private static string GetMimeType(string ext)
        {
            switch (ext)
            {
                case ".html": return "text/html; charset=UTF-8";
                case ".css": return "text/css; charset=UTF-8";
                case ".js": return "application/javascript; charset=UTF-8";
                case ".json": return "application/json; charset=UTF-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".ico": return "image/x-icon";
                case ".svg": return "image/svg+xml";
                case ".mp3": return "audio/mpeg";
                default: return "application/octet-stream";
            }
        }

        private static void LaunchDesktopWindow()
        {
            string url = "http://127.0.0.1:" + _port + "/index.html";

            // Search for Edge or Chrome in app mode (frameless native desktop UI)
            string edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe");
            if (!File.Exists(edge))
            {
                edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe");
            }

            string chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe");
            if (!File.Exists(chrome))
            {
                chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe");
            }

            string browserExe = File.Exists(edge) ? edge : (File.Exists(chrome) ? chrome : null);

            if (browserExe != null)
            {
                string userProfile = Path.Combine(Path.GetTempPath(), "PreZifyAppData");
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = browserExe,
                    Arguments = string.Format("--app=\"{0}\" --window-size=1280,820 --user-data-dir=\"{1}\"", url, userProfile),
                    UseShellExecute = false
                };

                try
                {
                    _browserProcess = Process.Start(psi);
                    if (_browserProcess != null)
                    {
                        _browserProcess.EnableRaisingEvents = true;
                        _browserProcess.Exited += (s, e) =>
                        {
                            // If closed, notify user or shutdown
                        };
                    }
                    return;
                }
                catch { }
            }

            // Fallback: Open in default browser
            try
            {
                Process.Start(url);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Could not launch PreZify window:\n" + ex.Message, "PreZify Launcher", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private static void SetupTrayIcon()
        {
            _trayIcon = new NotifyIcon();

            string iconPath = Path.Combine(_appDir, "images", "prezify.ico");
            if (File.Exists(iconPath))
            {
                try
                {
                    _trayIcon.Icon = new Icon(iconPath);
                }
                catch
                {
                    _trayIcon.Icon = SystemIcons.Application;
                }
            }
            else
            {
                _trayIcon.Icon = SystemIcons.Application;
            }

            _trayIcon.Text = "PreZify - Feel Every Beat. Live Every Moment.";
            _trayIcon.Visible = true;

            ContextMenuStrip menu = new ContextMenuStrip();
            menu.Items.Add("🎵 Open PreZify", null, (s, e) => LaunchDesktopWindow());
            menu.Items.Add("🌐 Open in Default Browser", null, (s, e) => Process.Start("http://127.0.0.1:" + _port + "/index.html"));
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("ℹ️ About PreZify", null, (s, e) =>
            {
                MessageBox.Show("PreZify v1.0.0\nPremium Music Streaming Platform\n\n\"Feel Every Beat. Live Every Moment.\"\n\nHigh-Fidelity Lossless Audio Engine & Web Audio DSP", "About PreZify", MessageBoxButtons.OK, MessageBoxIcon.Information);
            });
            menu.Items.Add("❌ Exit PreZify", null, (s, e) => ExitApplication());

            _trayIcon.ContextMenuStrip = menu;
            _trayIcon.DoubleClick += (s, e) => LaunchDesktopWindow();
        }

        private static void ExitApplication()
        {
            _isRunning = false;
            try
            {
                if (_listener != null && _listener.IsListening)
                {
                    _listener.Stop();
                    _listener.Close();
                }
            }
            catch { }

            if (_trayIcon != null)
            {
                _trayIcon.Visible = false;
                _trayIcon.Dispose();
            }

            Application.Exit();
            Environment.Exit(0);
        }
    }
}

