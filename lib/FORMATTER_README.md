# AI Response Formatter

## Overview

The `formatter.js` utility provides comprehensive text formatting for AI responses received from webhooks. It handles markdown-style formatting, cleans up excess whitespace, and ensures responses are properly rendered on the frontend.

## Features

### 1. **Bold Text Formatting**
Converts `**text**` to bold formatting that the ChatMessage component renders correctly.

**Example Input:**
```
**Player Car:** A single car controlled by the player.
**Controls:** The player can move the car left and right using the arrow keys.
```

**Output:**
```
**Player Car:** A single car controlled by the player.
**Controls:** The player can move the car left and right using the arrow keys.
```
(Rendered with bold styling in the UI)

---

### 2. **Header Conversion**
Converts markdown headers (`###`, `##`, `#`) to bold text without the hash symbols.

**Example Input:**
```
### Game Concept: Highway Racer

The objective is to control a car on a multi-lane highway.

## Core Mechanics
```

**Output:**
```
**Game Concept: Highway Racer**

The objective is to control a car on a multi-lane highway.

**Core Mechanics**
```

---

### 3. **Bullet Point Normalization**
Converts various bullet point markers (`*`, `-`, `•`) to a consistent format.

**Example Input:**
```
*   **Player Car:** A single car controlled by the player.
*   **Controls:** The player can move the car left and right.
-   **Obstacles:** Enemy cars will appear at the top.
•   **Scoring:** The score increases over time.
```

**Output:**
```
• **Player Car:** A single car controlled by the player.
• **Controls:** The player can move the car left and right.
• **Obstacles:** Enemy cars will appear at the top.
• **Scoring:** The score increases over time.
```

---

### 4. **Whitespace Cleanup**
Removes excessive blank lines and trailing whitespace.

**Example Input:**
```
Line 1



Line 2
```

**Output:**
```
Line 1

Line 2
```

---

### 5. **Escape Character Handling**
Removes unnecessary escape characters that might come from the webhook.

**Example Input:**
```
This is a \*test\* with escaped characters.
```

**Output:**
```
This is a *test* with escaped characters.
```

---

## Usage

### In Webhook Handler (`lib/n8n-webhook.js`)

The formatter is automatically applied to all AI responses:

```javascript
import { processAIMessage } from './formatter';

// Inside generateChatResponse function
const formattedMessage = processAIMessage(aiMessage);

return {
  success: true,
  message: formattedMessage,
  // ...
};
```

### Direct Usage

You can also use the formatter functions directly:

```javascript
import { 
  formatAIResponse, 
  cleanWebhookResponse, 
  processAIMessage 
} from './lib/formatter';

// Format a simple text string
const formatted = formatAIResponse(rawText);

// Clean and extract from webhook response
const cleaned = cleanWebhookResponse(webhookResponse);

// Complete processing pipeline (recommended)
const processed = processAIMessage(responseOrText);
```

---

## API Reference

### `formatAIResponse(text)`
Formats AI response text by converting markdown-style formatting.
- **Parameters:** `text` (string) - Raw AI response text
- **Returns:** Formatted text ready for rendering

### `cleanWebhookResponse(response)`
Extracts and cleans text from various webhook response formats.
- **Parameters:** `response` (Object|string) - Raw webhook response
- **Returns:** Cleaned message text

### `sanitizeMessage(message)`
Sanitizes message content for security (removes script tags, etc.).
- **Parameters:** `message` (string) - Message content to validate
- **Returns:** Sanitized message

### `processAIMessage(response)`
Complete processing pipeline (clean → format → sanitize).
- **Parameters:** `response` (Object|string) - Raw webhook response or text
- **Returns:** Fully processed message ready for display

### `formatSystemMessage(message, type)`
Formats system messages with appropriate icons.
- **Parameters:** 
  - `message` (string) - Message to format
  - `type` (string) - One of: 'error', 'warning', 'info', 'success'
- **Returns:** Formatted message with icon

---

## Example: Complete Flow

### Input from Webhook:
```javascript
{
  "output": "### Game Concept: Highway Racer\n\nThe objective is to control a car on a multi-lane highway.\n\n### Core Mechanics\n*   **Player Car:** A single car controlled by the player.\n*   **Controls:** The player can move the car left and right.\n*   **Obstacles:** Enemy cars will appear at the top."
}
```

### After Processing:
```
**Game Concept: Highway Racer**

The objective is to control a multi-lane highway.

**Core Mechanics**
• **Player Car:** A single car controlled by the player.
• **Controls:** The player can move the car left and right.
• **Obstacles:** Enemy cars will appear at the top.
```

### Rendered on UI:
The text appears with:
- Bold headers (Game Concept, Core Mechanics)
- Bold labels (Player Car, Controls, Obstacles)
- Consistent bullet points
- Proper spacing

---

## Integration Points

1. **Webhook Response** (`lib/n8n-webhook.js`)
   - Automatically formats all AI responses before returning

2. **Chat Message Display** (`components/ChatMessage.js`)
   - Receives pre-formatted text
   - Renders bold text using `**text**` syntax
   - Processes code blocks separately

3. **API Routes** (`src/app/api/chats/route.js`)
   - Stores formatted messages in database
   - No additional processing needed

---

## Testing

To test the formatter with your own examples:

```javascript
import { processAIMessage } from './lib/formatter';

const testResponse = {
  output: "### Test Header\n\n**Bold text** and normal text\n\n*   Bullet 1\n*   Bullet 2"
};

const result = processAIMessage(testResponse);
console.log(result);
```

---

## Security

The formatter includes basic XSS protection by removing:
- `<script>` tags
- `<iframe>` tags
- `<object>` tags
- `<embed>` tags

This provides a basic security layer while preserving legitimate formatting.

---

## Future Enhancements

Potential improvements for the formatter:
- Support for italic text (`*text*` or `_text_`)
- Strikethrough support (`~~text~~`)
- Link formatting (`[text](url)`)
- Table formatting
- Nested list support
- Custom emoji conversion

---

## Troubleshooting

### Bold text not rendering
- Ensure the text contains proper `**text**` markers
- Check that there are no extra spaces inside the markers
- Verify ChatMessage component is properly processing the text

### Headers still showing hash symbols
- Check if the formatter is being applied before saving to database
- Verify the import statement in `n8n-webhook.js`

### Excessive whitespace
- The formatter removes more than 2 consecutive newlines
- If you need custom spacing, consider adjusting the regex in `formatAIResponse`

---

## Questions?

For issues or questions about the formatter, check:
1. Console logs in the webhook handler
2. Browser console for rendering errors
3. Database to verify stored message format
