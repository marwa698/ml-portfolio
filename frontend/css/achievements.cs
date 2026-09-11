/* ===================================
   Achievements Section (كروت أيقونة + وصف، مختلفة عن Certificates)
   =================================== */
.achievements-showcase-section {
  padding: 80px 0;
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.ach-card {
  display: block;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
  transition: all var(--transition-base);
}

a.ach-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.ach-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: #fff;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.ach-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ach-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
}

.ach-subtitle {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--accent-cyan);
  margin-bottom: 12px;
}

.ach-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .ach-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .ach-grid { grid-template-columns: 1fr; }
}