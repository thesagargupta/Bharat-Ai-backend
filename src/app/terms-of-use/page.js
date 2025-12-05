"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiFileText, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function TermsOfUsePage() {
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
                <FiFileText size={24} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Terms of Use</h1>
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
              Welcome to <span className="font-semibold text-orange-600">Bharat AI</span>! 
              These Terms of Use govern your access to and use of our AI assistant service. By accessing or using Bharat AI, 
              you agree to be bound by these terms. If you do not agree, please do not use our service.
            </p>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            
            <div className="ml-9 text-gray-700 space-y-3">
              <p>
                By creating an account and using Bharat AI, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>You are at least 13 years of age</li>
                <li>You have the legal capacity to enter into these terms</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate and up-to-date</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Use of Service */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 License Grant</h3>
                <p className="text-gray-700">
                  Bharat AI grants you a limited, non-exclusive, non-transferable, revocable license to use our service 
                  for personal, non-commercial purposes, subject to these terms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Permitted Uses</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ask questions and receive AI-generated responses</li>
                  <li>Upload images for analysis</li>
                  <li>Perform web searches through our interface</li>
                  <li>Use AI tools for legitimate purposes</li>
                  <li>Generate content for personal or educational use</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Prohibited Uses</h3>
                <div className="flex items-start gap-2 text-red-600 mb-2">
                  <FiXCircle className="mt-1 flex-shrink-0" />
                  <p className="font-semibold">You agree NOT to:</p>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Generate harmful, offensive, or discriminatory content</li>
                  <li>Attempt to hack, reverse engineer, or compromise our systems</li>
                  <li>Spam, phish, or engage in fraudulent activities</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Violate intellectual property rights</li>
                  <li>Use automated tools (bots) without permission</li>
                  <li>Overload or disrupt our infrastructure</li>
                  <li>Collect user data without consent</li>
                  <li>Resell or commercialize our service without authorization</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: User Accounts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            
            <div className="ml-4 space-y-3 text-gray-700">
              <p>
                <strong>3.1 Account Creation:</strong> You can create an account using Google or GitHub OAuth. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p>
                <strong>3.2 Account Security:</strong> You must notify us immediately of any unauthorized access 
                or security breach. We are not liable for losses due to stolen or compromised credentials.
              </p>
              <p>
                <strong>3.3 Account Termination:</strong> We reserve the right to suspend or terminate your account 
                if you violate these terms or engage in prohibited activities.
              </p>
            </div>
          </div>

          {/* Section 4: Content and Intellectual Property */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content and Intellectual Property</h2>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Your Content</h3>
                <p className="text-gray-700">
                  You retain ownership of content you submit (messages, images, etc.). By using Bharat AI, 
                  you grant us a license to process and store your content to provide our service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 AI-Generated Content</h3>
                <p className="text-gray-700">
                  Content generated by Bharat AI is provided "as is." While you can use AI-generated content, 
                  we recommend reviewing and verifying it before relying on it for important decisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Our Intellectual Property</h3>
                <p className="text-gray-700">
                  All software, trademarks, logos, and service marks related to Bharat AI are owned by us or our licensors. 
                  You may not copy, modify, or distribute our intellectual property without permission.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: AI Limitations and Disclaimers */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <FiAlertCircle className="text-yellow-600 mt-1" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">5. AI Limitations and Disclaimers</h2>
            </div>
            
            <div className="ml-9 space-y-3">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-800 font-semibold mb-2">⚠️ Important Disclaimer</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>AI responses may contain errors or inaccuracies</li>
                  <li>Do not rely solely on AI for medical, legal, or financial advice</li>
                  <li>Always verify critical information from authoritative sources</li>
                  <li>AI may produce biased or inappropriate content despite safeguards</li>
                  <li>We are not responsible for decisions made based on AI responses</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6: Privacy and Data Protection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
            <p className="ml-4 text-gray-700">
              Your use of Bharat AI is also governed by our{" "}
              <span 
                className="text-orange-600 font-semibold cursor-pointer hover:underline"
                onClick={() => router.push('/privacy-policy')}
              >
                Privacy Policy
              </span>
              . We collect, use, and protect your data as described in that policy.
            </p>
          </div>

          {/* Section 7: Service Availability */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
            <div className="ml-4 text-gray-700 space-y-2">
              <p>
                <strong>7.1 Uptime:</strong> We strive to provide 24/7 service availability but do not guarantee uninterrupted access. 
                Maintenance, updates, or technical issues may cause temporary outages.
              </p>
              <p>
                <strong>7.2 Modifications:</strong> We reserve the right to modify, suspend, or discontinue any feature 
                of Bharat AI at any time without prior notice.
              </p>
            </div>
          </div>

          {/* Section 8: Fees and Payments */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Fees and Payments</h2>
            <p className="ml-4 text-gray-700">
              Bharat AI is currently <strong className="text-green-600">FREE</strong> to use. If we introduce paid features in the future, 
              we will notify users and provide clear pricing information.
            </p>
          </div>

          {/* Section 9: Limitation of Liability */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="ml-4 text-gray-700 space-y-2">
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bharat AI is provided "AS IS" and "AS AVAILABLE" without warranties</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed ₹1,000 or the amount you paid us (if any)</li>
                <li>We are not responsible for third-party content or services accessed through our platform</li>
              </ul>
            </div>
          </div>

          {/* Section 10: Indemnification */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="ml-4 text-gray-700">
              You agree to indemnify and hold harmless Bharat AI, its developers, and affiliates from any claims, 
              damages, or expenses arising from your use of the service or violation of these terms.
            </p>
          </div>

          {/* Section 11: Governing Law */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
            <p className="ml-4 text-gray-700">
              These Terms of Use are governed by the laws of India. Any disputes shall be resolved in the courts 
              of Delhi, India.
            </p>
          </div>

          {/* Section 12: Changes to Terms */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to These Terms</h2>
            <p className="ml-4 text-gray-700">
              We may update these Terms of Use from time to time. We will notify you of significant changes by 
              posting a notice on our website or sending an email. Continued use after changes constitutes acceptance.
            </p>
          </div>

          {/* Section 13: Contact Information */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <div className="ml-4 text-gray-700 space-y-2">
              <p>If you have questions about these Terms of Use, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p><strong>Email:</strong> sagarkshn8@gmail.com</p>
                <p><strong>Support:</strong> sagarkshn8@gmail.com</p>
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

          {/* Acceptance Statement */}
          <div className="mt-8 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
            <p className="text-gray-800 font-semibold">
              By using Bharat AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </p>
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
