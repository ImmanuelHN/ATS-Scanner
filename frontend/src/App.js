import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

// ─── SCORE RING COMPONENT ─────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const color =
    score >= 75 ? "#00ff88" :
      score >= 50 ? "#d4a853" :
        "#ff4444";

  return (
    <div className="score-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle className="score-ring-bg" cx="70" cy="70" r={radius} />
        <circle
          className="score-ring-fill"
          cx="70" cy="70" r={radius}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-number" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="score-pct">MATCH %</span>
      </div>
    </div>
  );
}

// ─── RESULT PANEL COMPONENT ───────────────────────────────────────────────────
function ResultPanel({ result }) {
  const score = result.match_score;

  const verdictConfig =
    score >= 80 ? {
      cls: "excellent",
      label: "EXCELLENT MATCH",
      sub: "Candidate strongly aligns with the job requirements.",
      icon: "🎯",
      badgeCls: "verdict-excellent",
    } :
      score >= 60 ? {
        cls: "good",
        label: "STRONG CANDIDATE",
        sub: "Candidate is a good fit but has minor gaps to address.",
        icon: "⚡",
        badgeCls: "verdict-good",
      } :
        score >= 40 ? {
          cls: "good",
          label: "PARTIAL MATCH",
          sub: "Candidate meets some requirements. Upskilling recommended.",
          icon: "⚠️",
          badgeCls: "verdict-good",
        } : {
          cls: "weak",
          label: "INSUFFICIENT MATCH",
          sub: "Candidate is missing critical skills required for this role.",
          icon: "✗",
          badgeCls: "verdict-weak",
        };

  const matchPct = result.matched_skills.length + result.missing_skills.length > 0
    ? Math.round((result.matched_skills.length / (result.matched_skills.length + result.missing_skills.length)) * 100)
    : 0;

  return (
    <div className="results-panel">

      {/* ── SCORE HERO ── */}
      <div className="score-hero">
        <p className="score-label">COMPATIBILITY SCORE</p>
        <div className="score-ring-container">
          <ScoreRing score={score} />
        </div>
        <span className={`score-verdict-badge ${verdictConfig.badgeCls}`}>
          <span>{verdictConfig.icon}</span>
          {verdictConfig.label}
        </span>
      </div>

      {/* ── SKILLS GRID ── */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Matched Skills</span>
            <span className="metric-count count-matched">{result.matched_skills.length} found</span>
          </div>
          <div className="skills-list">
            {result.matched_skills.length > 0
              ? result.matched_skills.map((s) => (
                <span key={s} className="skill-chip chip-matched">✓ {s}</span>
              ))
              : <span style={{ fontSize: "8px", color: "var(--text-dim)", letterSpacing: "1px" }}>NONE DETECTED</span>
            }
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Missing Skills</span>
            <span className="metric-count count-missing">{result.missing_skills.length} gaps</span>
          </div>
          <div className="skills-list">
            {result.missing_skills.length > 0
              ? result.missing_skills.map((s) => (
                <span key={s} className="skill-chip chip-missing">✗ {s}</span>
              ))
              : <span style={{ fontSize: "8px", color: "var(--green-neon)", letterSpacing: "1px" }}>ALL COVERED ✓</span>
            }
          </div>
        </div>
      </div>

      {/* ── DETAILED EVALUATION ── */}
      <div className="evaluation-card">

        <div className="eval-section">
          <div className="eval-section-title">AI Analysis</div>

          <div className="eval-row">
            <div className="eval-icon icon-info">📊</div>
            <div className="eval-content">
              <div className="eval-content-title">Semantic Similarity Score</div>
              <div className="eval-content-body">
                NLP embedding analysis returned a {score.toFixed(1)}% semantic match between the
                candidate's profile and the job description. This measures conceptual alignment beyond
                keyword matching.
              </div>
            </div>
          </div>

          <div className="eval-row">
            <div className="eval-icon icon-ok">🔬</div>
            <div className="eval-content">
              <div className="eval-content-title">Skill Coverage</div>
              <div className="eval-content-body">
                {result.matched_skills.length} of {result.matched_skills.length + result.missing_skills.length} required skills
                detected — {matchPct}% skill coverage.
                {matchPct === 100
                  ? " Perfect skill alignment achieved."
                  : matchPct >= 70
                    ? " Strong coverage with minor gaps."
                    : " Moderate coverage — targeted upskilling advised."}
              </div>
            </div>
          </div>

          {result.matched_skills.length > 0 && (
            <div className="eval-row">
              <div className="eval-icon icon-ok">✅</div>
              <div className="eval-content">
                <div className="eval-content-title">Strengths Identified</div>
                <div className="eval-content-body">
                  Candidate demonstrates proficiency in: {result.matched_skills.join(", ")}.
                  These are verified against JD requirements using fuzzy matching with ≥85% confidence threshold.
                </div>
              </div>
            </div>
          )}

          {result.missing_skills.length > 0 && (
            <div className="eval-row">
              <div className="eval-icon icon-warn">⚠️</div>
              <div className="eval-content">
                <div className="eval-content-title">Skill Gaps Identified</div>
                <div className="eval-content-body">
                  The following skills required by the JD were not found in the resume:{" "}
                  {result.missing_skills.join(", ")}.
                  Candidate should address these gaps to improve competitiveness.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="eval-section">
          <div className="eval-section-title">Recruiter Insights</div>

          <div className="eval-row">
            <div className="eval-icon icon-info">💡</div>
            <div className="eval-content">
              <div className="eval-content-title">Interview Recommendation</div>
              <div className="eval-content-body">
                {score >= 75
                  ? "Strongly recommended for technical interview. Candidate profile aligns well with role expectations."
                  : score >= 50
                    ? "Consider for a preliminary screening call to evaluate the skill gaps before a full technical round."
                    : "Not recommended at this stage. Resume requires significant improvement to meet minimum threshold."}
              </div>
            </div>
          </div>

          <div className="eval-row">
            <div className="eval-icon icon-info">📋</div>
            <div className="eval-content">
              <div className="eval-content-title">ATS Filter Outcome</div>
              <div className="eval-content-body">
                {score >= 60
                  ? `This resume would PASS most ATS filters for this role (threshold typically 55–65%). Score: ${score.toFixed(1)}%.`
                  : `This resume may be FILTERED OUT by automated ATS systems. Score ${score.toFixed(1)}% is below the typical 60% threshold.`}
              </div>
            </div>
          </div>
        </div>

        {/* ── VERDICT BANNER ── */}
        <div className={`verdict-banner ${verdictConfig.cls}`}>
          <span className="verdict-banner-icon">{verdictConfig.icon}</span>
          <div className="verdict-banner-text">
            <div className="verdict-banner-title">{verdictConfig.label}</div>
            <div className="verdict-banner-sub">{verdictConfig.sub}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function App() {
  const canvasRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false); // false = Red Mode (default), true = Dark Mode
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── PARTICLE SYSTEM ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        // Dark mode → burgundy particles on near-black bg
        // Red mode  → dark black particles on burgundy bg
        ctx.fillStyle = darkMode ? `rgba(128,0,32,${this.opacity})` : `rgba(0,0,0,${this.opacity + 0.1})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  // ── ANALYZE ──────────────────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!file || !jd.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jd);

      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/analyze-resume`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [file, jd]);

  const canAnalyze = file && jd.trim().length > 10 && !loading;

  return (
    <div className={`app${darkMode ? " dark-mode" : ""}`}>
      <canvas ref={canvasRef} className="canvas" />

      {/* ── NAV BAR ── */}
      <nav className="nav-bar">
        <div className="nav-logo">
          <div className="nav-logo-icon">ST</div>
          <div>
            <div className="nav-logo-text">ATS <span>AI</span></div>
            <div className="nav-tagline">Resume Intelligence Platform</div>
          </div>
        </div>
        <div className="nav-actions">
          <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            <span className="mode-dot" />
            {darkMode ? "DARK MODE" : "RED MODE"}
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="main-content">

        {/* HERO */}
        <div className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered · NLP Embeddings · Skill Matching
          </div>
          <h1 className="hero-title">ATS AI</h1>
          <p className="hero-subtitle">Intelligent Resume Scoring &amp; Analysis</p>
        </div>

        {/* UPLOAD PANEL */}
        <div className="upload-panel">
          <div className="panel-label">01 &mdash; Upload Resume</div>

          <div className={`file-zone${file ? " has-file" : ""}`}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => { setFile(e.target.files[0]); setResult(null); }}
            />
            {file ? (
              <>
                <span className="file-zone-icon">📄</span>
                <div className="file-zone-title">Resume Loaded</div>
                <div className="file-zone-name">{file.name}</div>
                <div className="file-zone-sub" style={{ marginTop: "6px" }}>
                  {(file.size / 1024).toFixed(1)} KB &bull; Click to replace
                </div>
              </>
            ) : (
              <>
                <span className="file-zone-icon">⬆</span>
                <div className="file-zone-title">Drop PDF Resume Here</div>
                <div className="file-zone-sub">or click to browse &bull; PDF only</div>
              </>
            )}
          </div>

          <div className="jd-section">
            <div className="panel-label">02 &mdash; Job Description</div>
            <textarea
              className="jd-textarea"
              placeholder="Paste the full job description here — include role overview, requirements, and responsibilities for the most accurate scoring..."
              value={jd}
              onChange={(e) => { setJd(e.target.value); setResult(null); }}
            />
          </div>

          <button
            className={`analyze-btn${loading ? " loading" : ""}`}
            onClick={analyze}
            disabled={!canAnalyze}
          >
            <span className="btn-text">
              {loading ? (
                <><span className="spinner" /> ANALYZING RESUME...</>
              ) : (
                "▶ RUN ATS ANALYSIS"
              )}
            </span>
          </button>

          {error && (
            <div style={{
              marginTop: "14px",
              padding: "12px 16px",
              background: "rgba(255,68,68,0.08)",
              border: "1px solid rgba(255,68,68,0.25)",
              borderRadius: "8px",
              fontSize: "9px",
              letterSpacing: "1px",
              color: "#ff6666",
              fontFamily: "'Orbitron', monospace",
            }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* RESULTS */}
        {result && <ResultPanel result={result} />}

      </main>
    </div>
  );
}

export default App;
