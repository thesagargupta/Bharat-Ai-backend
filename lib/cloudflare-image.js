// Cloudflare Workers AI Image Generation Service
// Professional image generation using Cloudflare Workers AI

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

// Available models for image generation
const IMAGE_MODELS = {
  'stable-diffusion': '@cf/stabilityai/stable-diffusion-xl-base-1.0',
  'flux': '@cf/black-forest-labs/flux-1-schnell',
  'dreamshaper': '@cf/lykon/dreamshaper-8-lcm'
};

export class CloudflareImageGenerator {
  constructor() {
    this.apiToken = CLOUDFLARE_API_TOKEN;
    this.accountId = CLOUDFLARE_ACCOUNT_ID;
  }

  /**
   * Generate image using Cloudflare Workers AI
   * @param {Object} options - Generation options
   * @param {string} options.prompt - The text prompt for image generation
   * @param {string} options.model - Model to use (default: 'stable-diffusion')
   * @param {number} options.steps - Number of inference steps (default: 20)
   * @param {number} options.guidance - Guidance scale (default: 7.5)
   * @param {string} options.size - Image size (default: '1024x1024')
   * @returns {Promise<ArrayBuffer>} Generated image as ArrayBuffer
   */
  async generateImage(options) {
    const {
      prompt,
      model = 'stable-diffusion',
      steps = 20,
      guidance = 7.5,
      size = '1024x1024'
    } = options;

    if (!prompt) {
      throw new Error('Prompt is required for image generation');
    }

    const modelName = IMAGE_MODELS[model] || IMAGE_MODELS['stable-diffusion'];
    
    try {
      const response = await fetch(
        `${CLOUDFLARE_API_BASE}/accounts/${this.accountId}/ai/run/${modelName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            num_steps: steps,
            guidance: guidance,
            width: parseInt(size.split('x')[0]),
            height: parseInt(size.split('x')[1])
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Cloudflare API error: ${response.status} - ${errorData}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating image with Cloudflare:', error);
      throw error;
    }
  }

  /**
   * Generate image and upload to Cloudinary for permanent storage
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Object with image URL and metadata
   */
  async generateAndUpload(options) {
    try {
      // Generate image
      const imageBuffer = await this.generateImage(options);
      
      // Convert ArrayBuffer to base64
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      
      // Upload to Cloudinary
      const { v2: cloudinary } = await import('cloudinary');
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          `data:image/png;base64,${base64Image}`,
          {
            folder: 'bharat-ai/generated-images',
            resource_type: 'image',
            format: 'png',
            public_id: `generated-${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        metadata: {
          prompt: options.prompt,
          model: options.model || 'stable-diffusion',
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error in generateAndUpload:', error);
      throw error;
    }
  }

  /**
   * Get available models
   * @returns {Object} Available models with descriptions
   */
  getAvailableModels() {
    return {
      'stable-diffusion': {
        name: 'Stable Diffusion XL',
        description: 'High-quality, versatile image generation',
        maxSize: '1024x1024',
        recommended: true
      },
      'flux': {
        name: 'FLUX.1 Schnell',
        description: 'Fast, high-quality image generation',
        maxSize: '1024x1024',
        speed: 'fast'
      },
      'dreamshaper': {
        name: 'DreamShaper 8 LCM',
        description: 'Artistic and creative image generation',
        maxSize: '1024x1024',
        style: 'artistic'
      }
    };
  }
}

// Default export for easy import
export default CloudflareImageGenerator;

// Utility function for generating images
export async function generateImage(prompt, options = {}) {
  const generator = new CloudflareImageGenerator();
  return await generator.generateAndUpload({
    prompt,
    ...options
  });
}