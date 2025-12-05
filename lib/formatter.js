/**
 * Response Formatter Utility
 * Cleans and formats AI responses from webhooks for proper rendering
 */

/**
 * Formats AI response text by converting markdown-style formatting to clean HTML-friendly format
 * @param {string} text - Raw AI response text
 * @returns {string} - Formatted text ready for rendering
 */
export const formatAIResponse = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let formatted = text;

  // Step 1: Handle bold text (**text** -> keep as is for ChatMessage component to handle)
  // The ChatMessage component already handles **bold** conversion
  // We just need to ensure proper spacing around them
  formatted = formatted.replace(/\*\*([^*\n]+?)\*\*/g, '**$1**');

  // Step 2: Clean up markdown headers (###, ##, #)
  // Convert headers to bold text without the # symbols
  formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, '**$1**');

  // Step 3: Handle bullet points and lists
  // Convert various list markers to consistent format
  formatted = formatted.replace(/^\s*[\*\-•]\s+/gm, '• ');
  
  // Handle numbered lists - keep them as is but ensure consistent spacing
  formatted = formatted.replace(/^(\d+)\.\s+/gm, '$1. ');

  // Step 4: Clean up excessive spacing
  // Remove multiple consecutive blank lines (more than 2)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Step 5: Trim whitespace from start and end
  formatted = formatted.trim();

  // Step 6: Handle escaped characters that shouldn't be escaped
  // But preserve intentional escapes in code blocks
  formatted = formatted.replace(/\\([^\\])/g, '$1');

  return formatted;
};

/**
 * Cleans webhook response and extracts formatted message
 * @param {Object|string} response - Raw webhook response
 * @returns {string} - Cleaned and formatted message text
 */
export const cleanWebhookResponse = (response) => {
  if (!response) {
    return '';
  }

  let rawText = '';

  // Extract text from various response formats
  if (typeof response === 'string') {
    rawText = response;
  } else if (response.output) {
    rawText = response.output;
  } else if (response.analysis) {
    rawText = response.analysis;
  } else if (response.data?.analysis) {
    rawText = response.data.analysis;
  } else if (response.text) {
    rawText = response.text;
  } else if (response.message) {
    rawText = response.message;
  } else if (response.response) {
    rawText = response.response;
  }

  // Apply formatting
  return formatAIResponse(rawText);
};

/**
 * Validates and sanitizes message content before rendering
 * @param {string} message - Message content to validate
 * @returns {string} - Sanitized message
 */
export const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // Remove potentially harmful HTML tags (basic XSS prevention)
  let sanitized = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*>/gi, '');
  
  return sanitized;
};

/**
 * Complete message processing pipeline
 * Cleans, formats, and sanitizes the message
 * @param {Object|string} response - Raw webhook response or message text
 * @returns {string} - Fully processed message ready for display
 */
export const processAIMessage = (response) => {
  // Step 1: Extract raw text from response
  const cleanedText = typeof response === 'string' 
    ? response 
    : cleanWebhookResponse(response);

  // Step 2: Format the text
  const formattedText = formatAIResponse(cleanedText);

  // Step 3: Sanitize for security
  const sanitizedText = sanitizeMessage(formattedText);

  return sanitizedText;
};

/**
 * Formats specific message types (error messages, system messages, etc.)
 * @param {string} message - Message to format
 * @param {string} type - Message type: 'error', 'warning', 'info', 'success'
 * @returns {string} - Formatted message with appropriate markers
 */
export const formatSystemMessage = (message, type = 'info') => {
  const icons = {
    error: '⚠️',
    warning: '⚡',
    info: 'ℹ️',
    success: '✅'
  };

  const icon = icons[type] || icons.info;
  return `${icon} ${message}`;
};

export default {
  formatAIResponse,
  cleanWebhookResponse,
  sanitizeMessage,
  processAIMessage,
  formatSystemMessage
};
