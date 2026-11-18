package com.sportcycle.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.Instant;
import java.util.Map;

@Controller
@Tag(name = "Root", description = "Root health and interactive landing portal")
public class RootController {

    @GetMapping(value = {"/", "/api/v1", "/api/v1/"}, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    @Operation(summary = "Interactive Web Portal", description = "Serves the live interactive SportCycle landing portal in HTML")
    public String getPortalHtml() {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SportCycle – Gear. Play. Repeat.</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary-lime: #B8D94B;
              --ivory-bg: #F8F9E9;
              --pure-white: #FFFFFF;
              --olive-green: #52642A;
              --dark-text: #26321A;
              --light-grey: #F3F4F6;
              --border-color: #E5E7EB;
              --shadow-sm: 0 1px 3px rgba(38, 50, 26, 0.08);
              --shadow-md: 0 4px 12px rgba(38, 50, 26, 0.08);
              --shadow-lg: 0 10px 25px rgba(38, 50, 26, 0.12);
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              background-color: var(--ivory-bg);
              color: var(--dark-text);
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
            }
            header {
              background-color: var(--pure-white);
              border-bottom: 1px solid var(--border-color);
              position: sticky;
              top: 0;
              z-index: 100;
              box-shadow: var(--shadow-sm);
            }
            .nav-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 1rem 1.5rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              text-decoration: none;
            }
            .logo-icon {
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, var(--primary-lime), var(--olive-green));
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--pure-white);
              font-weight: 800;
              font-size: 1.25rem;
            }
            .brand-name {
              font-size: 1.4rem;
              font-weight: 800;
              color: var(--olive-green);
              letter-spacing: -0.5px;
            }
            .brand-tag {
              background-color: var(--primary-lime);
              color: var(--dark-text);
              font-size: 0.7rem;
              font-weight: 700;
              padding: 0.2rem 0.5rem;
              border-radius: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .nav-links {
              display: flex;
              align-items: center;
              gap: 1.25rem;
            }
            .nav-link {
              color: var(--dark-text);
              text-decoration: none;
              font-weight: 600;
              font-size: 0.92rem;
              transition: color 0.2s ease;
            }
            .nav-link:hover {
              color: var(--olive-green);
            }
            .btn {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.65rem 1.25rem;
              border-radius: 8px;
              font-weight: 700;
              font-size: 0.92rem;
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s ease;
              border: none;
            }
            .btn-lime {
              background-color: var(--primary-lime);
              color: var(--dark-text);
              box-shadow: 0 2px 6px rgba(184, 217, 75, 0.4);
            }
            .btn-lime:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(184, 217, 75, 0.6);
            }
            .btn-olive {
              background-color: var(--olive-green);
              color: var(--pure-white);
            }
            .btn-olive:hover {
              background-color: #3f4e20;
              transform: translateY(-2px);
            }
            .btn-outline {
              background-color: transparent;
              color: var(--dark-text);
              border: 1px solid var(--border-color);
            }
            .btn-outline:hover {
              background-color: var(--pure-white);
              border-color: var(--dark-text);
            }
            .hero {
              max-width: 1200px;
              margin: 2.5rem auto 3rem;
              padding: 0 1.5rem;
              text-align: center;
            }
            .status-pill {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              background-color: var(--pure-white);
              border: 1px solid var(--border-color);
              padding: 0.4rem 1rem;
              border-radius: 50px;
              font-size: 0.85rem;
              font-weight: 600;
              margin-bottom: 1.5rem;
              box-shadow: var(--shadow-sm);
            }
            .pulse-dot {
              width: 10px;
              height: 10px;
              background-color: #10B981;
              border-radius: 50%;
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
              animation: pulse 1.6s infinite;
            }
            @keyframes pulse {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
              70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
            .hero h1 {
              font-size: 3.25rem;
              font-weight: 800;
              color: var(--olive-green);
              line-height: 1.15;
              letter-spacing: -1px;
              margin-bottom: 1rem;
            }
            .hero p {
              font-size: 1.2rem;
              color: #4b5563;
              max-width: 680px;
              margin: 0 auto 2rem;
            }
            .hero-actions {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 1rem;
              flex-wrap: wrap;
            }
            .stats-bar {
              max-width: 1100px;
              margin: 0 auto 3rem;
              padding: 0 1.5rem;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
              gap: 1.25rem;
            }
            .stat-card {
              background-color: var(--pure-white);
              padding: 1.5rem;
              border-radius: 12px;
              border: 1px solid var(--border-color);
              box-shadow: var(--shadow-sm);
              text-align: center;
            }
            .stat-number {
              font-size: 2rem;
              font-weight: 800;
              color: var(--olive-green);
            }
            .stat-label {
              font-size: 0.85rem;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 0.25rem;
            }
            .main-section {
              max-width: 1200px;
              margin: 0 auto 4rem;
              padding: 0 1.5rem;
            }
            .section-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 1.5rem;
            }
            .section-title {
              font-size: 1.75rem;
              font-weight: 800;
              color: var(--olive-green);
            }
            .sports-pills {
              display: flex;
              gap: 0.65rem;
              overflow-x: auto;
              padding-bottom: 0.75rem;
              margin-bottom: 2rem;
              scrollbar-width: thin;
            }
            .sport-pill {
              padding: 0.5rem 1rem;
              border-radius: 50px;
              background-color: var(--pure-white);
              border: 1px solid var(--border-color);
              font-size: 0.88rem;
              font-weight: 600;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            .sport-pill:hover, .sport-pill.active {
              background-color: var(--olive-green);
              color: var(--pure-white);
              border-color: var(--olive-green);
            }
            .product-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
              gap: 1.5rem;
            }
            .product-card {
              background-color: var(--pure-white);
              border-radius: 14px;
              border: 1px solid var(--border-color);
              overflow: hidden;
              box-shadow: var(--shadow-sm);
              transition: all 0.3s ease;
              display: flex;
              flex-direction: column;
            }
            .product-card:hover {
              transform: translateY(-4px);
              box-shadow: var(--shadow-md);
            }
            .product-img-wrapper {
              position: relative;
              width: 100%;
              height: 220px;
              background-color: var(--light-grey);
              overflow: hidden;
            }
            .product-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
            .product-card:hover .product-img {
              transform: scale(1.05);
            }
            .badge-condition {
              position: absolute;
              top: 12px;
              left: 12px;
              padding: 0.3rem 0.6rem;
              border-radius: 6px;
              font-size: 0.75rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .badge-new {
              background-color: var(--primary-lime);
              color: var(--dark-text);
            }
            .badge-used {
              background-color: #FEF3C7;
              color: #92400E;
            }
            .product-body {
              padding: 1.25rem;
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            .product-sport {
              font-size: 0.75rem;
              font-weight: 700;
              color: var(--olive-green);
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 0.35rem;
            }
            .product-title {
              font-size: 1rem;
              font-weight: 700;
              color: var(--dark-text);
              margin-bottom: 0.5rem;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              height: 2.8rem;
            }
            .product-price-row {
              margin-top: auto;
              display: flex;
              align-items: baseline;
              gap: 0.5rem;
              padding-top: 0.75rem;
              border-top: 1px solid var(--border-color);
            }
            .price-current {
              font-size: 1.25rem;
              font-weight: 800;
              color: var(--dark-text);
            }
            .price-orig {
              font-size: 0.9rem;
              color: #9CA3AF;
              text-decoration: line-through;
            }
            .endpoints-card {
              background-color: var(--pure-white);
              border-radius: 14px;
              border: 1px solid var(--border-color);
              padding: 1.5rem;
              box-shadow: var(--shadow-sm);
              margin-top: 3rem;
            }
            .table-wrap {
              overflow-x: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
            }
            th, td {
              padding: 0.85rem 1rem;
              text-align: left;
              border-bottom: 1px solid var(--border-color);
              font-size: 0.9rem;
            }
            th {
              background-color: var(--light-grey);
              font-weight: 700;
              color: var(--dark-text);
            }
            .badge-method {
              padding: 0.2rem 0.5rem;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 700;
            }
            .badge-get { background-color: #DEF7EC; color: #03543F; }
            .badge-post { background-color: #E1EFFE; color: #1E429F; }
            footer {
              background-color: var(--pure-white);
              border-top: 1px solid var(--border-color);
              padding: 2.5rem 1.5rem;
              text-align: center;
              margin-top: 4rem;
            }
            footer p {
              font-size: 0.9rem;
              color: #6B7280;
            }
          </style>
        </head>
        <body>
          <header>
            <div class="nav-container">
              <a href="/api/v1/" class="brand">
                <div class="logo-icon">SC</div>
                <div>
                  <span class="brand-name">SPORTCYCLE</span>
                  <span class="brand-tag">Online</span>
                </div>
              </a>
              <nav class="nav-links">
                <a href="/swagger-ui.html" class="nav-link">Swagger Docs</a>
                <a href="/api/v1/products" class="nav-link">Products API</a>
                <a href="/api/v1/sports" class="nav-link">Sports</a>
                <a href="https://github.com/GOWTHAM-SK2006/sportcycle" target="_blank" class="btn btn-lime">GitHub Repo</a>
              </nav>
            </div>
          </header>

          <section class="hero">
            <div class="status-pill">
              <span class="pulse-dot"></span>
              <span>All Systems Operational • Supabase PostgreSQL Connected</span>
            </div>
            <h1>Your Game. Your Gear.</h1>
            <p><strong>GEAR. PLAY. REPEAT.</strong> – Production REST API & E-Commerce Catalog Engine. Multi-sport marketplace spanning 12 athletic disciplines with certified pre-owned verification.</p>
            <div class="hero-actions">
              <a href="/swagger-ui.html" class="btn btn-olive">🚀 Open Swagger UI Docs</a>
              <a href="/api/v1/products" target="_blank" class="btn btn-lime">📦 View Products JSON</a>
              <a href="/api/v1/sports" target="_blank" class="btn btn-outline">⚽ View 12 Sports JSON</a>
            </div>
          </section>

          <section class="stats-bar">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">12</div>
                <div class="stat-label">Sports Disciplines</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">24</div>
                <div class="stat-label">Relational Tables</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">Java 21</div>
                <div class="stat-label">Spring Boot 3.3.5</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">Postgres 17</div>
                <div class="stat-label">Supabase Cloud</div>
              </div>
            </div>
          </section>

          <section class="main-section">
            <div class="section-header">
              <h2 class="section-title">Live Equipment Catalog</h2>
              <span style="font-size: 0.9rem; color: #6B7280;">Real-time feed from Supabase</span>
            </div>

            <div class="sports-pills" id="sportsContainer">
              <button class="sport-pill active" onclick="filterProducts('all')">All Sports</button>
            </div>

            <div class="product-grid" id="productGrid">
              <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p>Loading live gear from Supabase PostgreSQL...</p>
              </div>
            </div>

            <div class="endpoints-card">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--olive-green); margin-bottom: 0.5rem;">API Endpoints Directory</h3>
              <p style="font-size: 0.9rem; color: #6B7280; margin-bottom: 1rem;">Direct URLs to test platform APIs in your browser:</p>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Endpoint</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="badge-method badge-get">GET</span></td>
                      <td><code>/api/v1/products</code></td>
                      <td>Search, filter & paginate equipment</td>
                      <td><a href="/api/v1/products" target="_blank" class="btn btn-outline" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Open JSON</a></td>
                    </tr>
                    <tr>
                      <td><span class="badge-method badge-get">GET</span></td>
                      <td><code>/api/v1/sports</code></td>
                      <td>All 12 sports catalog</td>
                      <td><a href="/api/v1/sports" target="_blank" class="btn btn-outline" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Open JSON</a></td>
                    </tr>
                    <tr>
                      <td><span class="badge-method badge-get">GET</span></td>
                      <td><code>/api/v1/categories</code></td>
                      <td>Product subcategories</td>
                      <td><a href="/api/v1/categories" target="_blank" class="btn btn-outline" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Open JSON</a></td>
                    </tr>
                    <tr>
                      <td><span class="badge-method badge-get">GET</span></td>
                      <td><code>/api/v1/brands</code></td>
                      <td>Certified brands directory</td>
                      <td><a href="/api/v1/brands" target="_blank" class="btn btn-outline" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Open JSON</a></td>
                    </tr>
                    <tr>
                      <td><span class="badge-method badge-get">GET</span></td>
                      <td><code>/swagger-ui.html</code></td>
                      <td>Interactive OpenAPI / Swagger Studio</td>
                      <td><a href="/swagger-ui.html" class="btn btn-lime" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Launch UI</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <footer>
            <p><strong>SPORTCYCLE</strong> © 2026 • Gear. Play. Repeat. • Multi-Sport E-Commerce Platform</p>
            <p style="margin-top: 0.5rem; font-size: 0.8rem;">Built with Next.js 14, Java 21, Spring Boot 3.3.5, Supabase PostgreSQL, and Railway.</p>
          </footer>

          <script>
            let allProducts = [];

            async function loadCatalog() {
              try {
                const [prodRes, sportRes] = await Promise.all([
                  fetch('/api/v1/products'),
                  fetch('/api/v1/sports')
                ]);
                
                const prodData = await prodRes.json();
                const sportData = await sportRes.json();

                if (sportData && Array.isArray(sportData)) {
                  const sContainer = document.getElementById('sportsContainer');
                  sportData.forEach(s => {
                    const btn = document.createElement('button');
                    btn.className = 'sport-pill';
                    btn.innerText = s.name;
                    btn.onclick = () => filterProducts(s.name);
                    sContainer.appendChild(btn);
                  });
                }

                if (prodData && prodData.data && prodData.data.content) {
                  allProducts = prodData.data.content;
                  renderProducts(allProducts);
                }
              } catch (err) {
                console.error("Failed to fetch live catalog:", err);
                document.getElementById('productGrid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Error connecting to API. Verify backend status.</p>';
              }
            }

            function filterProducts(sport) {
              document.querySelectorAll('.sport-pill').forEach(b => {
                b.classList.toggle('active', b.innerText === sport || (sport === 'all' && b.innerText === 'All Sports'));
              });
              if (sport === 'all') {
                renderProducts(allProducts);
              } else {
                const filtered = allProducts.filter(p => p.sportName && p.sportName.toLowerCase() === sport.toLowerCase());
                renderProducts(filtered);
              }
            }

            function renderProducts(products) {
              const grid = document.getElementById('productGrid');
              if (!products || products.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No items listed for this sport yet.</p>';
                return;
              }
              grid.innerHTML = products.map(p => `
                <div class="product-card">
                  <div class="product-img-wrapper">
                    <img src="${p.primaryImageUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'}" alt="${p.title}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'">
                    <span class="badge-condition ${p.isPreOwned ? 'badge-used' : 'badge-new'}">${p.condition.replace('_', ' ')}</span>
                  </div>
                  <div class="product-body">
                    <span class="product-sport">${p.sportName || 'Sports'}</span>
                    <h3 class="product-title" title="${p.title}">${p.title}</h3>
                    <div class="product-price-row">
                      <span class="price-current">₹${Number(p.price).toLocaleString()}</span>
                      ${p.originalPrice ? `<span class="price-orig">₹${Number(p.originalPrice).toLocaleString()}</span>` : ''}
                    </div>
                  </div>
                </div>
              `).join('');
            }

            document.addEventListener('DOMContentLoaded', loadCatalog);
          </script>
        </body>
        </html>
        """;
    }

    @GetMapping(value = {"/", "/api/v1", "/api/v1/"}, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @Operation(summary = "API Health & Status (JSON)", description = "Returns service health, version, and Swagger documentation links in JSON")
    public ResponseEntity<Map<String, Object>> rootJson() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "SPORTCYCLE REST API",
                "version", "1.0.0",
                "tagline", "Gear. Play. Repeat.",
                "timestamp", Instant.now().toString(),
                "swaggerUi", "/swagger-ui.html",
                "apiDocs", "/v3/api-docs",
                "productsApi", "/api/v1/products",
                "sportsApi", "/api/v1/sports"
        ));
    }
}
