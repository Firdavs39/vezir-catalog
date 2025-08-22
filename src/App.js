import React, { useState, useEffect, useRef } from 'react';

// Весь CSS-код теперь находится здесь, внутри компонента
const AppStyles = () => (
  <style>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .vezir-app {
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      overflow-x: hidden;
      background: #0a0a0a;
      color: #fff;

      --card-bg: rgba(255, 255, 255, 0.02);
      --card-backdrop-filter: blur(20px);
      --card-border: 1px solid rgba(218, 165, 32, 0.1);
      --card-border-radius: 24px;
      --card-border-color-hover: rgba(218, 165, 32, 0.3);
      --card-shadow-hover: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 60px rgba(218, 165, 32, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      --card-transform-hover: translateY(-8px) scale(1.02);
      --card-transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Динамический фон с параллакс */
    .dynamic-background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      overflow: hidden;
    }

    .bg-layer {
      position: absolute;
      top: -20%;
      left: -20%;
      right: -20%;
      bottom: -20%;
      transition: transform 0.1s ease-out;
      will-change: transform;
    }

    .layer-1 {
      background: radial-gradient(
        ellipse at calc(var(--mouse-x) * 0.8) calc(var(--mouse-y) * 0.8),
        rgba(139, 69, 19, 0.1) 0%,
        rgba(101, 67, 33, 0.05) 40%,
        transparent 70%
      );
      transform: translate(calc((var(--mouse-x) - 50) * -0.02%), calc((var(--mouse-y) - 50) * -0.02%));
    }

    .layer-2 {
      background: radial-gradient(
        ellipse at calc(var(--mouse-x) * 1.2) calc(var(--mouse-y) * 1.2),
        rgba(218, 165, 32, 0.08) 0%,
        rgba(184, 134, 11, 0.04) 50%,
        transparent 80%
      );
      transform: translate(calc((var(--mouse-x) - 50) * -0.05%), calc((var(--mouse-y) - 50) * -0.05%));
    }

    .layer-3 {
      background: 
        linear-gradient(135deg, 
          rgba(139, 69, 19, 0.02) 0%,
          rgba(160, 82, 45, 0.03) 25%,
          rgba(218, 165, 32, 0.02) 50%,
          rgba(184, 134, 11, 0.03) 75%,
          transparent 100%
        );
      transform: translate(calc((var(--mouse-x) - 50) * -0.08%), calc((var(--mouse-y) - 50) * -0.08%));
    }

    .floating-particles {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: radial-gradient(circle, rgba(218, 165, 32, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      left: var(--start-x);
      top: var(--start-y);
      animation: float var(--duration) linear infinite var(--delay);
    }

    @keyframes float {
      0% {
        transform: translateY(100vh) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
        transform: translateY(90vh) translateX(10px) scale(1);
      }
      90% {
        opacity: 1;
        transform: translateY(10vh) translateX(-10px) scale(1);
      }
      100% {
        transform: translateY(-10vh) translateX(0) scale(0);
        opacity: 0;
      }
    }

    .content {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      transform: translateZ(0);
    }

    .screen-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .screen-enter {
      animation: screenEnterAnim 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .screen-exit {
      animation: screenExitAnim 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes screenEnterAnim {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes screenExitAnim {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-30px);
      }
    }

    /* Hero Section */
    .hero-section {
      text-align: center;
      padding: 60px 0 80px;
      position: relative;
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .hero-title {
      margin-bottom: 24px;
    }

    .title-main {
      display: block;
      font-size: clamp(3.5rem, 8vw, 6rem);
      font-weight: 800;
      background: linear-gradient(135deg, 
        #DAA520 0%, 
        #B8860B 25%, 
        #FFD700 50%, 
        #FFA500 75%, 
        #FF8C00 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      text-shadow: 0 0 60px rgba(218, 165, 32, 0.3);
      letter-spacing: -0.02em;
      line-height: 0.9;
      animation: titleGlow 4s ease-in-out infinite alternate;
    }

    .title-sub {
      display: block;
      font-size: clamp(0.9rem, 2vw, 1.2rem);
      font-weight: 300;
      color: rgba(218, 165, 32, 0.8);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 8px;
    }

    .hero-description {
      font-size: clamp(1.1rem, 2.5vw, 1.3rem);
      color: rgba(255, 255, 255, 0.7);
      font-weight: 300;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }

    @keyframes titleGlow {
      0% { text-shadow: 0 0 60px rgba(218, 165, 32, 0.3); }
      100% { text-shadow: 0 0 80px rgba(218, 165, 32, 0.5); }
    }

    /* Loading Screen */
    .loading-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 20px;
    }

    .loading-screen p {
      color: rgba(218, 165, 32, 0.8);
      font-size: 1.1rem;
      font-weight: 500;
    }

    /* Categories Section */
    .categories-section {
      margin-top: 40px;
    }

    .section-title {
      text-align: center;
      font-size: clamp(1.8rem, 4vw, 2.4rem);
      font-weight: 600;
      color: #fff;
      margin-bottom: 50px;
      position: relative;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #DAA520, transparent);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-top: 40px;
    }

    .category-card {
      position: relative;
      background: var(--card-bg);
      backdrop-filter: var(--card-backdrop-filter);
      border: var(--card-border);
      border-radius: var(--card-border-radius);
      padding: 32px;
      cursor: pointer;
      transition: var(--card-transition);
      overflow: hidden;
    }

    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(218, 165, 32, 0.1) 0%, 
        rgba(184, 134, 11, 0.05) 100%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .category-card:hover {
      transform: var(--card-transform-hover);
      border-color: var(--card-border-color-hover);
      box-shadow: var(--card-shadow-hover);
    }

    .category-card:hover::before {
      opacity: 1;
    }

    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at var(--mouse-x) var(--mouse-y),
        rgba(218, 165, 32, 0.08) 0%,
        transparent 60%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .category-card:hover .card-background {
      opacity: 1;
    }

    .card-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .category-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      filter: drop-shadow(0 0 20px rgba(218, 165, 32, 0.3));
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .category-card:hover .category-icon {
      transform: scale(1.1);
    }

    .category-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .category-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }

    .category-count {
      font-size: 0.95rem;
      color: rgba(218, 165, 32, 0.8);
      font-weight: 400;
    }

    .card-shine {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, 
        transparent 30%, 
        rgba(255, 255, 255, 0.05) 50%, 
        transparent 70%
      );
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
      transition: transform 0.6s ease;
    }

    .category-card:hover .card-shine {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }

    /* Screen Header */
    .screen-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 40px;
      padding: 20px 0;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--card-bg);
      backdrop-filter: var(--card-backdrop-filter);
      border: var(--card-border);
      color: #DAA520;
      padding: 12px 20px;
      border-radius: var(--card-border-radius);
      font-weight: 500;
      cursor: pointer;
      transition: var(--card-transition);
      font-size: 0.95rem;
    }

    .back-button:hover {
      background: rgba(218, 165, 32, 0.1);
      transform: translateX(-4px);
      border-color: var(--card-border-color-hover);
    }

    .back-arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .back-button:hover .back-arrow {
      transform: translateX(-4px);
    }

    .header-content {
      flex: 1;
    }

    .screen-title {
      font-size: clamp(1.8rem, 4vw, 2.4rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }

    .screen-subtitle {
      color: rgba(218, 165, 32, 0.7);
      font-size: 1rem;
      font-weight: 400;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
    }

    .product-card {
      position: relative;
      background: var(--card-bg);
      backdrop-filter: var(--card-backdrop-filter);
      border: var(--card-border);
      border-radius: var(--card-border-radius);
      overflow: hidden;
      cursor: pointer;
      transition: var(--card-transition);
    }

    .product-card:hover {
      transform: var(--card-transform-hover);
      border-color: var(--card-border-color-hover);
      box-shadow: var(--card-shadow-hover);
    }

    .product-image-wrapper {
      position: relative;
      height: 240px;
      overflow: hidden;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #1a1a1a;
    }

    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover .image-container img {
      transform: scale(1.1);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.3) 100%
      );
      z-index: 1;
    }

    .image-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      background: radial-gradient(
        circle,
        rgba(218, 165, 32, 0.15) 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .product-card:hover .image-glow {
      opacity: 1;
    }

    .image-loader {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(16, 16, 16, 0.8);
      backdrop-filter: blur(10px);
    }

    .luxury-spinner {
      width: 40px;
      height: 40px;
      border: 2px solid rgba(218, 165, 32, 0.2);
      border-top: 2px solid #DAA520;
      border-radius: 50%;
      animation: luxurySpin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes luxurySpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .image-fallback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: rgba(16, 16, 16, 0.8);
      backdrop-filter: blur(10px);
      gap: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .fallback-icon {
      font-size: 3rem;
      opacity: 0.6;
    }

    .image-fallback span {
      font-size: 0.9rem;
    }

    .product-info {
      padding: 24px;
      position: relative;
      z-index: 2;
    }

    .product-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }

    .product-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: #DAA520;
      margin-bottom: 12px;
    }

    .product-details {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .detail-item {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.05);
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(218, 165, 32, 0.1);
    }

    .card-hover-effect {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(218, 165, 32, 0.05) 0%,
        transparent 100%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .product-card:hover .card-hover-effect {
      opacity: 1;
    }

    /* Product Detail */
    .product-hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: start;
    }

    .product-image-hero {
      position: relative;
    }

    .hero-image {
      width: 100%;
      height: 400px;
      border-radius: var(--card-border-radius);
      overflow: hidden;
      background: var(--card-bg);
      backdrop-filter: var(--card-backdrop-filter);
      border: var(--card-border);
    }

    .product-details-main {
      padding: 20px 0;
    }

    .product-header {
      margin-bottom: 32px;
    }

    .product-title {
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .product-price-large {
      font-size: 1.6rem;
      font-weight: 600;
      color: #DAA520;
    }

    .specs-grid {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }

    .spec-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: var(--card-bg);
      backdrop-filter: var(--card-backdrop-filter);
      border: var(--card-border);
      border-radius: var(--card-border-radius);
      transition: var(--card-transition);
    }

    .spec-card:hover {
      transform: var(--card-transform-hover);
      border-color: var(--card-border-color-hover);
      box-shadow: var(--card-shadow-hover);
    }

    .spec-label {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
    }

    .spec-value {
      font-weight: 600;
      color: #fff;
    }

    .sizes-section {
      margin-bottom: 40px;
    }

    .sizes-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 20px;
    }

    .sizes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .size-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: var(--card-bg);
      backdrop-filter: var(--card-backdrop-filter);
      border: var(--card-border);
      border-radius: var(--card-border-radius);
      border-left: 3px solid #DAA520;
      transition: var(--card-transition);
    }

    .size-card:hover {
      background: rgba(218, 165, 32, 0.05);
      transform: translateY(-4px);
      border-color: var(--card-border-color-hover);
    }

    .size-dimensions {
      font-family: 'Monaco', 'Consolas', monospace;
      font-weight: 600;
      color: #fff;
      font-size: 0.95rem;
    }

    .size-unit {
      font-size: 0.85rem;
      color: rgba(218, 165, 32, 0.8);
    }

    .contact-button {
      position: relative;
      width: 100%;
      background: linear-gradient(135deg, #DAA520 0%, #B8860B 100%);
      color: #000;
      border: none;
      padding: 20px 32px;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .contact-button:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 15px 30px rgba(218, 165, 32, 0.4),
        0 0 60px rgba(218, 165, 32, 0.3);
    }

    .contact-button:active {
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 1.3rem;
    }

    .button-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.3), 
        transparent
      );
      transition: left 0.6s ease;
    }

    .contact-button:hover .button-glow {
      left: 100%;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .screen-container {
        padding: 16px;
      }

      .hero-section {
        padding: 40px 0 60px;
      }

      .categories-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .category-card {
        padding: 24px;
      }

      .products-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .product-hero {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .hero-image {
        height: 300px;
      }

      .screen-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .sizes-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .title-main {
        font-size: 3rem;
      }

      .category-card {
        padding: 20px;
      }

      .product-image-wrapper {
        height: 200px;
      }

      .contact-button {
        padding: 16px 24px;
        font-size: 1rem;
      }
    }
  `}</style>
);


const App = () => {
  const [view, setView] = useState({
    screen: 'categories',
    category: null,
    product: null,
  });
  const [animationClass, setAnimationClass] = useState('screen-enter');
  const [viewKey, setViewKey] = useState(0);
  const appRef = useRef(null);

  const products = [
    {
      id: 1,
      category: 'Стол островной',
      name: 'ChefMax',
      sizes: ['1100×700×850', '1500×700×850', '1800×800×850', '2000×800×850', '2300×1100×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/TBLdpB6k/stol-chefmax.jpg',
      price: 'По запросу'
    },
    {
      id: 2,
      category: 'Стол островной',
      name: 'ZETA',
      sizes: ['1100×700×850', '1500×700×850', '1800×800×850', '2000×800×850', '2300×1100×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/8DY3BVTy/stol-zeta.jpg',
      price: 'По запросу'
    },
    {
      id: 3,
      category: 'Стол островной',
      name: 'ChefRack',
      sizes: ['1100×700×850', '1500×700×850', '1800×800×850', '2000×800×850', '2300×1100×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/KzKLPf3H/stol-chefrack.jpg',
      price: 'По запросу'
    },
    {
      id: 4,
      category: 'Стол островной',
      name: 'ZETA-X',
      sizes: ['1100×700×850', '1500×700×850', '1800×800×850', '2000×800×850', '2300×1100×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/35fJ2czS/stol-zetax.jpg',
      price: 'По запросу'
    },
    {
      id: 5,
      category: 'Стол островной',
      name: 'INOVANTA',
      sizes: ['1100×700×850', '1100×800×850', '1500×700×850', '1500×800×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/XxyD2v4j/stol-inovanta.jpg',
      price: 'По запросу'
    },
    {
      id: 6,
      category: 'Стол островной',
      name: 'INOVANTA-Z',
      sizes: ['1100×700×850', '1100×800×850', '1500×700×850', '1500×800×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/rKRk31hG/stol-inovantaz.jpg',
      price: 'По запросу'
    },
    {
      id: 7,
      category: 'Стеллаж',
      name: 'STELLARIO',
      sizes: ['1120×500×1600', '1520×500×1800', '1800×500×2000', '2000×500×2000', '2340×500×2000'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '4-5 полок',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/8gjj8QzT/stellazh-stellario.jpg',
      price: 'По запросу'
    },
    {
      id: 8,
      category: 'Стеллаж',
      name: 'MaxStell (сушилка)',
      sizes: ['600×250×450', '700×250×1600', '800×350×1600', '900×350×1600'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/QFdRCg65/sushilka-maxstell.jpg',
      price: 'По запросу'
    },
    {
      id: 9,
      category: 'Стеллаж',
      name: 'MaxStell 2 (сушилка)',
      sizes: ['1000×600×1300', '900×600×1300'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '3 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/hx2twFv2/sushilka-maxstell-2.jpg',
      price: 'По запросу'
    },
    {
      id: 10,
      category: 'Мойка для посуды',
      name: 'CULINOX PRO',
      sizes: ['600×650×850', '1140×650×850', '1700×650×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '2 года',
      notes: '1-3 лотка',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/M51FQ0hq/moyka-culinox-pro.jpg',
      price: 'По запросу'
    },
    {
      id: 11,
      category: 'Мойка для посуды',
      name: 'CULINOX-Y',
      sizes: ['550×600×850', '1050×600×850', '1550×600×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '2 года',
      notes: '1-3 лотка',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/G3d6XdLy/moyka-culinox-y.jpg',
      price: 'По запросу'
    },
    {
      id: 12,
      category: 'Электроплита',
      name: 'KITCHENOX',
      sizes: ['800×800×850', '1400×800×850'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '2 года',
      notes: '4 и 6 горелок',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/HTzYWLR4/plita-kitchenox.jpg',
      price: 'По запросу'
    },
    {
      id: 13,
      category: 'Вытяжка',
      name: 'SilverRack',
      sizes: ['1100×900×400(250)', '1500×900×400(250)', '1800×900×400(250)'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '2 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/TBYrXKf8/vytyazhka-silverrack.jpg',
      price: 'По запросу'
    },
    {
      id: 14,
      category: 'Вытяжка',
      name: 'KvadroRack',
      sizes: ['1600×1500×400(250)', '2000×1500×400(250)', '2400×1500×400(250)'],
      steel: 'AISI 201, AISI 430, AISI 304',
      warranty: '2 года',
      notes: '',
      delivery: 'Да',
      export: 'Да',
      image: 'https://i.ibb.co/XntpzP9/vytyazhka-kvadrorack.jpg',
      price: 'По запросу'
    }
  ];

  const categories = [...new Set(products.map(product => product.category))];
  const getProductsByCategory = (category) => products.filter(product => product.category === category);

  const categoryIcons = {
    'Стол островной': '/icons/stol.png',
    'Стеллаж': '/icons/stelaj.png',
    'Мойка для посуды': '/icons/moyka.png',
    'Электроплита': '/icons/plita.png',
    'Вытяжка': '/icons/vitejka.png',
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (appRef.current) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        appRef.current.style.setProperty('--mouse-x', `${x}%`);
        appRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigate = (newView) => {
    setAnimationClass('screen-exit');
    setTimeout(() => {
      setView(newView);
      setViewKey(key => key + 1);
      setAnimationClass('screen-enter');
    }, 400);
  };

  const handleContactManager = (product) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/vezir_manager?text=Здравствуйте! Интересует ${product.name}, нужен индивидуальный расчет.`);
    } else {
      window.open(`https://t.me/vezir_manager?text=Здравствуйте! Интересует ${product.name}, нужен индивидуальный расчет.`, '_blank');
    }
  };

  const renderScreen = () => {
    switch (view.screen) {
      case 'products':
        return (
          <ProductsScreen
            category={view.category}
            products={getProductsByCategory(view.category)}
            onProductSelect={(product) => navigate({ screen: 'product-detail', category: view.category, product })}
            onBack={() => navigate({ screen: 'categories' })}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailScreen
            product={view.product}
            onBack={() => navigate({ screen: 'products', category: view.category })}
            onContact={handleContactManager}
          />
        );
      case 'categories':
      default:
        return (
          <CategoriesScreen
            categories={categories}
            onCategorySelect={(category) => navigate({ screen: 'products', category })}
            getProductsByCategory={getProductsByCategory}
            categoryIcons={categoryIcons}
          />
        );
    }
  };

  return (
    <div className="vezir-app" ref={appRef}>
      <AppStyles />
      <div className="dynamic-background">
        <div className="bg-layer layer-1"></div>
        <div className="bg-layer layer-2"></div>
        <div className="bg-layer layer-3"></div>
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${15 + i % 10}s`,
              '--start-x': `${Math.random() * 100}%`,
              '--start-y': `${Math.random() * 100}%`
            }}></div>
          ))}
        </div>
      </div>
      
      <div className="content">
        <div key={viewKey} className={`screen-container ${animationClass}`}>
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

const PremiumImage = ({ src, alt, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  return (
    <div className={`${className} image-container`}>
      <div className="image-overlay"></div>
      {!imageError ? (
        <img 
          src={src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transform: imageLoaded ? 'scale(1)' : 'scale(1.05)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      ) : (
        <div className="image-fallback">
          <div className="fallback-icon">⚙️</div>
          <span>{alt || 'Оборудование'}</span>
        </div>
      )}
      {!imageLoaded && !imageError && (
        <div className="image-loader">
          <div className="luxury-spinner"></div>
        </div>
      )}
    </div>
  );
};

const CategoriesScreen = ({ categories, onCategorySelect, getProductsByCategory, categoryIcons }) => (
  <>
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-main">VEZIR</span>
          <span className="title-sub">Professional Kitchen Equipment</span>
        </h1>
        <p className="hero-description">
          Премиальное оборудование из нержавеющей стали для профессиональных кухонь
        </p>
      </div>
    </div>
    <div className="categories-section">
      <h2 className="section-title">Категории оборудования</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={category}
            className="category-card"
            onClick={() => onCategorySelect(category)}
            style={{ animation: `cardEnter 0.8s ${index * 0.1}s cubic-bezier(0.4, 0, 0.2, 1) both` }}
          >
            <div className="card-background"></div>
            <div className="card-content">
              <div className="category-icon">
                <img src={categoryIcons[category]} alt={category} />
              </div>
              <h3 className="category-title">{category}</h3>
              <p className="category-count">{getProductsByCategory(category).length} моделей</p>
              <div className="card-shine"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const ProductsScreen = ({ category, products, onProductSelect, onBack }) => (
  <>
    <div className="screen-header">
      <button className="back-button" onClick={onBack}>
        <span className="back-arrow">←</span>
        <span>Назад</span>
      </button>
      <div className="header-content">
        <h2 className="screen-title">{category}</h2>
        <p className="screen-subtitle">{products.length} премиальных моделей</p>
      </div>
    </div>
    <div className="products-grid">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="product-card"
          onClick={() => onProductSelect(product)}
          style={{ animation: `cardEnter 0.6s ${index * 0.08}s cubic-bezier(0.4, 0, 0.2, 1) both` }}
        >
          <div className="product-image-wrapper">
            <PremiumImage 
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="image-glow"></div>
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <div className="product-details">
              <span className="detail-item">{product.steel.split(',')[0]}</span>
              <span className="detail-item">{product.warranty}</span>
            </div>
          </div>
          <div className="card-hover-effect"></div>
        </div>
      ))}
    </div>
  </>
);

const ProductDetailScreen = ({ product, onBack, onContact }) => {
  if (!product) return <div className="loading-screen"><div className="luxury-spinner"></div></div>;

  return (
    <>
      <div className="screen-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Назад</span>
        </button>
      </div>
      <div className="product-hero">
        <div className="product-image-hero">
          <PremiumImage 
            src={product.image}
            alt={product.name}
            className="hero-image"
          />
        </div>
        <div className="product-details-main">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price-large">{product.price}</p>
          </div>
          <div className="specs-grid">
            <div className="spec-card">
              <span className="spec-label">Марка стали</span>
              <span className="spec-value">{product.steel}</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Гарантия</span>
              <span className="spec-value">{product.warranty}</span>
            </div>
            {product.notes && (
              <div className="spec-card">
                <span className="spec-label">Особенности</span>
                <span className="spec-value">{product.notes}</span>
              </div>
            )}
          </div>
          <div className="sizes-section">
            <h3 className="sizes-title">Стандартные размеры</h3>
            <div className="sizes-grid">
              {product.sizes.map((size, index) => (
                <div key={index} className="size-card">
                  <span className="size-dimensions">{size}</span>
                  <span className="size-unit">мм</span>
                </div>
              ))}
            </div>
          </div>
          <button className="contact-button" onClick={() => onContact(product)}>
            <span className="button-icon">💬</span>
            <span>Запросить индивидуальный расчет</span>
            <div className="button-glow"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
