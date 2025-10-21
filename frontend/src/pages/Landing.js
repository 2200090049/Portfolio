import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { FaCode, FaChartLine, FaPaintBrush, FaRocket } from 'react-icons/fa';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { selectRole } = usePortfolio();
  const [hovered, setHovered] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [glitchEffect, setGlitchEffect] = useState(false);
  const canvasRef = useRef(null);

  const roles = [
    {
      id: 'developer',
      title: 'Software Developer',
      subtitle: 'Full Stack & Mobile Architect',
      icon: FaCode,
      color: '#00ff41',
      gradient: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
      description: 'Crafting digital experiences with code',
      keywords: ['React', 'Node.js', 'Mobile', 'API', 'DevOps'],
      textColor: '#000000', // Black text for visibility on green
      titleOpacity: 0.9
    },
    {
      id: 'datascience',
      title: 'Data Scientist',
      subtitle: 'ML Engineer & Analytics Expert',
      icon: FaChartLine,
      color: '#00d4ff',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
      description: 'Transforming data into intelligence',
      keywords: ['Python', 'ML', 'SQL', 'Analytics', 'AI'],
      textColor: '#ffffff',
      titleOpacity: 1
    },
    {
      id: 'ux',
      title: 'UX/UI Designer',
      subtitle: 'Human-Centered Design Strategist',
      icon: FaPaintBrush,
      color: '#0080ff',
      gradient: 'linear-gradient(135deg, #0080ff 0%, #00d4ff 100%)',
      description: 'Designing emotional digital journeys',
      keywords: ['Research', 'Design', 'Prototype', 'Testing', 'Strategy'],
      textColor: '#000000', // Black text for visibility on blue
      titleOpacity: 1
    }
  ];

  // Canvas animation for background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.5)`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (roleId) => {
    selectRole(roleId);
    
    // Play sound if enabled (sound files not included yet)
    // if (soundEnabled) {
    //   const audio = new Audio('/sounds/select.mp3');
    //   audio.volume = 0.3;
    //   audio.play().catch(() => {});
    // }

    // Navigate with delay for animation
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };

  return (
    <div className="landing-container">
      <canvas ref={canvasRef} className="landing-canvas" />
      
      {/* Custom Cursor */}
      <motion.div
        className="custom-cursor"
        animate={{
          x: cursorPos.x - 10,
          y: cursorPos.y - 10,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* Main Content */}
      <div className="landing-content">
        {/* Header */}
        <motion.div
          className={`landing-header ${glitchEffect ? 'glitch' : ''}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="landing-title">
            KURUGUNTLA DEEPAK REDDY
          </h1>
        </motion.div>

        {/* Role Cards */}
        <div className="role-cards-container">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              className="role-card"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + index * 0.2,
                type: 'spring',
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50,
              }}
              onHoverStart={() => setHovered(role.id)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="role-card-inner" style={{
                background: hovered === role.id ? role.gradient : 'rgba(255,255,255,0.05)',
              }}>
                {/* Animated Icon */}
                <motion.div
                  className="role-icon"
                  animate={{
                    rotateY: hovered === role.id ? 360 : 0,
                    scale: hovered === role.id ? 1.2 : 1,
                  }}
                  transition={{ 
                    duration: 0.6,
                    rotateY: { duration: 0.8 }
                  }}
                  style={{
                    color: hovered === role.id ? role.textColor : role.color,
                    fontSize: '4rem',
                    marginBottom: '1rem'
                  }}
                >
                  <role.icon />
                </motion.div>

                {/* Title */}
                <h2 className="role-title" style={{ 
                  color: hovered === role.id ? role.textColor : role.color,
                  opacity: role.titleOpacity,
                  textShadow: role.id === 'developer' && !hovered ? '0 0 10px rgba(0,255,65,0.5)' : 'none'
                }}>
                  {role.title}
                </h2>
                
                <p className="role-subtitle" style={{ 
                  color: hovered === role.id ? role.textColor : 'rgba(255, 255, 255, 0.6)' 
                }}>
                  {role.subtitle}
                </p>

                {/* Description - Removed as per user request */}
                {/* <AnimatePresence>
                  {hovered === role.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="role-description"
                      style={{ color: role.textColor }}
                    >
                      <p>{role.description}</p>
                      <div className="role-keywords">
                        {role.keywords.map((keyword, i) => (
                          <span key={i} className="keyword-tag" style={{
                            borderColor: role.textColor,
                            color: role.textColor,
                          }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence> */}

                {/* Enter Button */}
                <motion.button
                  className="role-enter-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: role.gradient,
                    color: role.textColor,
                  }}
                >
                  <FaRocket /> Enter
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="landing-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p>Scroll to explore • Click to enter • Escape to reality</p>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-element"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default Landing;
