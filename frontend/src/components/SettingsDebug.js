import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './SettingsDebug.css';

const SettingsDebug = () => {
  const settingsContext = useSettings();
  const { settings, socialLinks, loading } = settingsContext;

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="settings-debug">
      <button 
        className="settings-debug-toggle"
        onClick={() => {
          document.querySelector('.settings-debug-panel').classList.toggle('open');
        }}
      >
        ⚙️ Debug Settings
      </button>
      
      <div className="settings-debug-panel">
        <h3>Settings Debug Panel</h3>
        
        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <>
            <div className="debug-section">
              <h4>📍 Site Info</h4>
              <pre>{JSON.stringify({
                siteName: settings?.siteName,
                siteTitle: settings?.siteTitle,
                siteDescription: settings?.siteDescription,
                availableForWork: settings?.availableForWork,
                availabilityMessage: settings?.availabilityMessage
              }, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>🎨 Theme</h4>
              <pre>{JSON.stringify(settings?.theme, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>🔧 Features</h4>
              <pre>{JSON.stringify(settings?.features, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>🔗 Social Links</h4>
              <pre>{JSON.stringify({
                github: socialLinks?.github,
                linkedin: socialLinks?.linkedin,
                twitter: socialLinks?.twitter,
                email: socialLinks?.email,
                customLinksCount: socialLinks?.customLinks?.length || 0
              }, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>📊 Analytics</h4>
              <pre>{JSON.stringify(settings?.analytics, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>🔍 SEO</h4>
              <pre>{JSON.stringify(settings?.seo, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>📧 Email Config</h4>
              <pre>{JSON.stringify({
                enabled: settings?.emailConfig?.enabled,
                smtpHost: settings?.emailConfig?.smtpHost,
                senderEmail: settings?.emailConfig?.senderEmail,
                autoReply: settings?.emailConfig?.autoReply
              }, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>🚧 Maintenance</h4>
              <pre>{JSON.stringify({
                maintenanceMode: settings?.maintenanceMode,
                maintenanceMessage: settings?.maintenanceMessage
              }, null, 2)}</pre>
            </div>

            <div className="debug-section">
              <h4>📦 Full Settings Object</h4>
              <details>
                <summary>Click to expand</summary>
                <pre>{JSON.stringify(settings, null, 2)}</pre>
              </details>
            </div>

            <div className="debug-section">
              <h4>🔗 Full Social Links Object</h4>
              <details>
                <summary>Click to expand</summary>
                <pre>{JSON.stringify(socialLinks, null, 2)}</pre>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsDebug;
