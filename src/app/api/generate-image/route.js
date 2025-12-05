import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Professional system prompt enhancement for image generation
function enhancePrompt(userPrompt) {
  // Add professional enhancement instructions
  const styleEnhancements = [
    "high quality",
    "detailed",
    "professional",
    "8k resolution", 
    "sharp focus",
    "award winning",
    "perfect composition"
  ];
  
  // Detect if it's artwork and add artistic enhancements
  const isArtwork = /art|painting|drawing|illustration|artistic|creative|fantasy|abstract/i.test(userPrompt);
  const isPhoto = /photo|photograph|realistic|portrait|landscape|street|documentary/i.test(userPrompt);
  
  let enhancedPrompt = userPrompt;
  
  if (isArtwork) {
    enhancedPrompt += ", digital art, trending on artstation, masterpiece, highly detailed, vibrant colors, dramatic lighting";
  } else if (isPhoto) {
    enhancedPrompt += ", professional photography, DSLR, studio lighting, bokeh effect, cinematic composition";
  } else {
    enhancedPrompt += ", " + styleEnhancements.slice(0, 4).join(", ");
  }
  
  return enhancedPrompt;
}

// Cloudflare image generation function
async function generateImageWithCloudflare(prompt, options = {}) {
  const {
    model = 'stable-diffusion',
    steps = 20,
    guidance = 7.5,
    size = '1024x1024'
  } = options;

  const modelMap = {
    'stable-diffusion': '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    'flux': '@cf/black-forest-labs/flux-1-schnell',
    'dreamshaper': '@cf/lykon/dreamshaper-8-lcm'
  };

  const modelName = modelMap[model] || modelMap['stable-diffusion'];
  const [width, height] = size.split('x').map(Number);
  
  // Enhance the prompt professionally
  const enhancedPrompt = enhancePrompt(prompt);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${modelName}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        num_steps: steps,
        guidance,
        width,
        height
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Cloudflare API error: ${response.status} - ${errorData}`);
  }

  return await response.arrayBuffer();
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, model, size, steps, guidance } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Validate prompt (basic content filtering)
    const bannedWords = ['nude', 'naked', 'explicit', 'nsfw', 'porn', 'sexual'];
    const lowerPrompt = prompt.toLowerCase();
    const hasBannedContent = bannedWords.some(word => lowerPrompt.includes(word));
    
    if (hasBannedContent) {
      return NextResponse.json({ 
        error: 'Content policy violation. Please use appropriate language.' 
      }, { status: 400 });
    }

    // Generate image with Cloudflare
    const imageBuffer = await generateImageWithCloudflare(prompt, {
      model: model || 'stable-diffusion',
      size: size || '1024x1024',
      steps: steps || 20,
      guidance: guidance || 7.5
    });

    // Convert ArrayBuffer to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    // Upload to Cloudinary
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

    return NextResponse.json({
      success: true,
      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        metadata: {
          prompt,
          model: model || 'stable-diffusion',
          generatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    if (error.message.includes('Cloudflare API error')) {
      return NextResponse.json({ 
        error: 'Image generation service temporarily unavailable' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate image' 
    }, { status: 500 });
  }
}

// Get available models
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const models = {
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

    return NextResponse.json({
      models,
      sizes: ['512x512', '768x768', '1024x1024', '1024x1792', '1792x1024'],
      defaultModel: 'stable-diffusion',
      defaultSize: '1024x1024'
    });

  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}