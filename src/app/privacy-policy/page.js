"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiShield, FiLock, FiEye, FiDatabase, FiUsers } from "react-icons/fi";
import { SiAdguard } from "react-icons/si";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <SiAdguard size={24} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-sm text-gray-500">Last updated: December 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              At <span className="font-semibold text-orange-600">Bharat AI</span>, we take your privacy seriously. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI assistant service.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiDatabase className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Account Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name and email address (via Google/GitHub OAuth)</li>
                  <li>Profile picture from your OAuth provider</li>
                  <li>Authentication tokens (securely stored)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Usage Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Chat conversations and messages</li>
                  <li>Images uploaded for analysis</li>
                  <li>Search queries and AI tool usage</li>
                  <li>Session duration and activity logs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Technical Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiEye className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-9">
              <li>Provide and maintain our AI assistant service</li>
              <li>Personalize your experience and improve responses</li>
              <li>Process and respond to your queries</li>
              <li>Analyze usage patterns to improve our service</li>
              <li>Ensure security and prevent fraud</li>
              <li>Send important updates and notifications</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          {/* Section 3: Data Storage and Security */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiLock className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">3. Data Storage and Security</h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS) and at rest</li>
                <li><strong>Authentication:</strong> Secure OAuth 2.0 with Google and GitHub</li>
                <li><strong>Access Control:</strong> Strict access controls and authentication required</li>
                <li><strong>Regular Audits:</strong> Periodic security assessments and updates</li>
                <li><strong>Data Centers:</strong> Hosted on secure Vercel infrastructure</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Data Sharing and Disclosure */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiUsers className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">4. Data Sharing and Disclosure</h2>
            </div>
            
            <div className="space-y-4 ml-9">
              <p className="text-gray-700">
                <strong>We do NOT sell your personal data.</strong> We may share your information only in these cases:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>With Your Consent:</strong> When you explicitly authorize us</li>
                <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., Vercel, OAuth providers)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Your Rights and Choices */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">5. Your Rights and Choices</h2>
            </div>
            
            <div className="space-y-3 ml-9 text-gray-700">
              <p>You have the following rights regarding your data:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from notifications</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, visit your <span className="text-orange-600 font-semibold cursor-pointer hover:underline" onClick={() => router.push('/setting')}>Settings</span> page or contact us.
              </p>
            </div>
          </div>

          {/* Section 6: Cookies and Tracking */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <div className="ml-4 space-y-3 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Maintain your session and keep you logged in</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Improve our service and user experience</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
              </p>
            </div>
          </div>

          {/* Section 7: Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="ml-4 text-gray-700">
              Bharat AI is not intended for users under 13 years of age. We do not knowingly collect personal information from children. 
              If you believe we have collected data from a child, please contact us immediately.
            </p>
          </div>

          {/* Section 8: International Data Transfers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="ml-4 text-gray-700">
              Your data may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place 
              to protect your data in accordance with this Privacy Policy and applicable data protection laws.
            </p>
          </div>

          {/* Section 9: Changes to This Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="ml-4 text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page 
              and updating the "Last updated" date. Continued use of Bharat AI after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Section 10: Contact Us */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <div className="ml-4 text-gray-700 space-y-2">
              <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p><strong>Email:</strong> sagarkshn8@gmail.com</p>
                <p><strong>Developer:</strong>{" "}
                  <a 
                    href="https://sagarguptaportfolio.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-600 font-semibold hover:underline"
                    style={{ textDecoration: 'none' }}
                  >
                    Sagar Gupta
                  </a>
                </p>
                <p><strong>Website:</strong> https://thebharatai.vercel.app</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            Bharat AI v1.0.0 •<br></br> Made with ❤️ by{" "}
            <a 
              href="https://sagarguptaportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sagar Gupta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
