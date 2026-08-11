import React from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Heart,
  Download,
  History,
  ArrowRight,
  Plus,
  Wand2,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-app">
      
      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <main className="dashboard-content">

        {/* ================================
            WELCOME
        ================================= */}

        <section className="welcome-section">

          <div className="welcome-text">

            <div className="workspace-badge">
              <Sparkles size={15} />

              <span>
                GenCanvasAI Workspace
              </span>
            </div>

            <h1>
              Welcome back, Sakshi
              <span className="wave">👋</span>
            </h1>

            <p>
              Turn your ideas into stunning AI-generated
              artwork. What will you create today?
            </p>

          </div>

          <Link
            to="/create-post"
            className="create-button"
          >
            <Plus size={20} />

            <span>
              Create New
            </span>
          </Link>

        </section>


        {/* ================================
            CREATIVE OVERVIEW
        ================================= */}

        <section className="overview-section">

          <div className="section-title">

            <h2>
              Your Creative Overview
            </h2>

            <p>
              Track your activity and creative journey.
            </p>

          </div>


          <div className="stats-grid">

            {/* Images Generated */}

            <div className="stat-card">

              <div className="stat-icon purple">
                <ImageIcon size={20} />
              </div>

              <div className="stat-info">

                <strong>24</strong>

                <span>
                  Images Generated
                </span>

              </div>

            </div>


            {/* Favorites */}

            <div className="stat-card">

              <div className="stat-icon pink">
                <Heart size={20} />
              </div>

              <div className="stat-info">

                <strong>8</strong>

                <span>
                  Favorites
                </span>

              </div>

            </div>


            {/* Downloads */}

            <div className="stat-card">

              <div className="stat-icon blue">
                <Download size={20} />
              </div>

              <div className="stat-info">

                <strong>15</strong>

                <span>
                  Downloads
                </span>

              </div>

            </div>


            {/* Generations */}

            <div className="stat-card">

              <div className="stat-icon violet">
                <History size={20} />
              </div>

              <div className="stat-info">

                <strong>24</strong>

                <span>
                  Generations
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            QUICK ACTIONS
        ================================= */}

        <section className="quick-actions-section">

          <div className="section-title">

            <h2>
              Quick Actions
            </h2>

            <p>
              Start creating or explore your creative world.
            </p>

          </div>


          <div className="quick-actions-grid">

            {/* Generate */}

            <Link
              to="/create-post"
              className="action-card generate-card"
            >

              <div className="action-icon">
                <Wand2 size={25} />
              </div>


              <div className="action-content">

                <h3>
                  Generate Image
                </h3>

                <p>
                  Turn your text prompt into
                  beautiful AI-generated artwork.
                </p>

                <span className="action-link">
                  Start Creating
                  <ArrowRight size={16} />
                </span>

              </div>

            </Link>


            {/* Gallery */}

            <Link
              to="/gallery"
              className="action-card gallery-card"
            >

              <div className="action-icon">
                <ImageIcon size={25} />
              </div>


              <div className="action-content">

                <h3>
                  Explore Gallery
                </h3>

                <p>
                  Discover inspiring artwork created
                  by the GenCanvasAI community.
                </p>

                <span className="action-link">
                  Explore Gallery
                  <ArrowRight size={16} />
                </span>

              </div>

            </Link>

          </div>

        </section>


        {/* ================================
            RECENT CREATIONS
        ================================= */}

        <section className="recent-section">

          <div className="recent-header">

            <div className="section-title">

              <h2>
                Recent Creations
              </h2>

              <p>
                Your latest AI-generated artwork.
              </p>

            </div>


            <Link
              to="/history"
              className="view-all"
            >
              View All
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="recent-grid">

            {/* Futuristic City */}

            <div className="recent-card">

              <div className="recent-placeholder">
                <Sparkles size={25} />
              </div>

              <div className="recent-info">

                <span>
                  Futuristic City
                </span>

                <small>
                  Today
                </small>

              </div>

            </div>


            {/* Fantasy World */}

            <div className="recent-card">

              <div className="recent-placeholder">
                <ImageIcon size={25} />
              </div>

              <div className="recent-info">

                <span>
                  Fantasy World
                </span>

                <small>
                  Yesterday
                </small>

              </div>

            </div>


            {/* AI Character */}

            <div className="recent-card">

              <div className="recent-placeholder">
                <Wand2 size={25} />
              </div>

              <div className="recent-info">

                <span>
                  AI Character
                </span>

                <small>
                  2 days ago
                </small>

              </div>

            </div>


            {/* Dream Landscape */}

            <div className="recent-card">

              <div className="recent-placeholder">
                <Sparkles size={25} />
              </div>

              <div className="recent-info">

                <span>
                  Dream Landscape
                </span>

                <small>
                  3 days ago
                </small>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;