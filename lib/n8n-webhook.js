// N8N Webhook Service - Replaces Gemini API with lighter webhook-based approach
import { processAIMessage } from './formatter';

/**
 * Call n8n webhook to generate AI chat response
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages for context
 * @param {Object} imageData - Optional image data {buffer, mimetype}
 * @returns {Object} - {success, message, usage, errorType}
 */
export const generateChatResponse = async (message, conversationHistory = [], imageData = null) => {
  try {
    // Prepare payload for n8n webhook
    const payload = {
      message: message,
      conversationHistory: conversationHistory.slice(-10), // Last 10 messages for context
      timestamp: new Date().toISOString(),
    };

    // Add image data if present (convert to base64 with metadata for Gemini 2.5 Pro)
    if (imageData) {
      const base64Data = imageData.buffer.toString('base64');
      const base64String = `data:${imageData.mimetype};base64,${base64Data}`;
      
      payload.image = base64String;
      payload.fileName = imageData.fileName || 'image.jpg';
      payload.fileSize = imageData.buffer.length;
      payload.fileType = imageData.mimetype;
    }

    // Call n8n webhook
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET || ''}`, // Optional auth
      },
      body: JSON.stringify(payload),
      // Increase timeout for AI processing
      signal: AbortSignal.timeout(60000), // 60 seconds timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook error: ${response.status} - ${errorText}`);
    }

    let result = await response.json();

    // Handle AI Agent response format from n8n
    // N8N returns array format: [{ output: "AI response text" }]
    // Check if result is an array and get the first item
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    }
    
    let aiMessage = '';
    
    // Support multiple response formats for Gemini 2.5 Pro via n8n
    if (result.output) {
      // AI Agent format
      aiMessage = result.output;
    } else if (result.analysis) {
      // Image analysis format
      aiMessage = result.analysis;
    } else if (result.data?.analysis) {
      // Nested analysis format
      aiMessage = result.data.analysis;
    } else if (result.text) {
      // Alternative text format
      aiMessage = result.text;
    } else if (result.message) {
      // Standard message format
      aiMessage = result.message;
    } else if (result.success && result.message) {
      // Legacy format with success flag
      aiMessage = result.message;
    } else if (result.response) {
      // Direct response format
      aiMessage = result.response;
    } else if (typeof result === 'string') {
      // Direct string response
      aiMessage = result;
    } else {
      console.error('Unknown response format:', result);
      throw new Error('Invalid response format from webhook');
    }

    // Process and format the AI message
    const formattedMessage = processAIMessage(aiMessage);

    return {
      success: true,
      message: formattedMessage,
      usage: result.usage || {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };

  } catch (error) {
    console.error('N8N Webhook error:', error);
    
    // Enhanced error categorization
    let errorMessage = "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment.";
    let errorType = 'unknown';
    
    // Check for specific error types
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      errorType = 'timeout';
      errorMessage = "⏱️ **Response Timeout**\n\nYour request took too long to process. Please try again with a shorter message or without large images.";
    } else if (error.message?.includes('503') || error.message?.includes('overloaded')) {
      errorType = 'overload';
      errorMessage = "🚦 **Service Temporarily Busy**\n\n" +
                    "The AI service is experiencing high traffic right now.\n\n" +
                    "**What you can do:**\n" +
                    "* Wait 30-60 seconds and try again\n" +
                    "* Your message is saved - just resend it when ready\n\n" +
                    "Thank you for your patience! 🙏";
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
      errorType = 'auth';
      errorMessage = "⚠️ **Service Configuration Issue**\n\nWebhook authentication failed. Please contact support for assistance.";
    } else if (error.message?.includes('network') || error.message?.includes('ECONNREFUSED')) {
      errorType = 'network';
      errorMessage = "🌐 **Connection Issue**\n\nUnable to reach the AI service. Please check your internet connection and try again.";
    }
    
    return {
      success: false,
      message: errorMessage,
      error: error.message,
      errorType,
    };
  }
};

/**
 * Generate chat title from first message (simple truncation, no AI call)
 * @param {string} firstMessage - First message in the chat
 * @returns {string} - Generated title
 */
export const generateChatTitle = async (firstMessage) => {
  // Simple title generation without calling webhook
  // Your N8N system prompt should handle the actual conversation
  if (!firstMessage || firstMessage.length === 0) {
    return 'New Chat';
  }
  
  // Clean and truncate the message to create a title
  const cleanMessage = firstMessage.trim().replace(/\n/g, ' ');
  
  if (cleanMessage.length <= 50) {
    return cleanMessage;
  }
  
  // Truncate at word boundary
  const truncated = cleanMessage.substring(0, 47);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 20) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

/**
 * Analyze image content via n8n webhook
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - Image MIME type
 * @param {string} userPrompt - Optional user prompt for image analysis
 * @returns {Object} - {success, analysis, error}
 */
export const analyzeImage = async (imageBuffer, mimeType, userPrompt = '') => {
  try {
    const payload = {
      action: 'analyze_image',
      image: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
      prompt: userPrompt || 'Please analyze this image and provide a detailed description.',
    };

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET || ''}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000), // 60 seconds for image analysis
    });

    if (!response.ok) {
      throw new Error('Image analysis failed');
    }

    const result = await response.json();

    return {
      success: true,
      analysis: result.analysis?.trim() || 'Image analyzed successfully.',
    };
    
  } catch (error) {
    console.error('Image analysis error:', error);
    return {
      success: false,
      analysis: "I'm unable to analyze this image at the moment. Please try again later.",
      error: error.message,
    };
  }
};

export default { generateChatResponse, generateChatTitle, analyzeImage };
