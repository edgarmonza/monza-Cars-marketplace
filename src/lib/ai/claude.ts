// ---------------------------------------------------------------------------
// Claude API Client
// ---------------------------------------------------------------------------
// Thin wrapper around the Anthropic SDK for vehicle analysis calls.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ---------------------------------------------------------------------------
// Core analysis function
// ---------------------------------------------------------------------------

/**
 * Send a prompt to Claude and return the text response.
 * Used by the analyzer module to get structured vehicle analysis.
 */
export async function analyzeVehicle(prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (block.type === 'text') return block.text;
  throw new Error('Unexpected response type from Claude API');
}

// ---------------------------------------------------------------------------
// Extended analysis with system prompt
// ---------------------------------------------------------------------------

/**
 * Send a prompt with a system instruction for more controlled output.
 */
export async function analyzeWithSystem(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type === 'text') return block.text;
  throw new Error('Unexpected response type from Claude API');
}

// ---------------------------------------------------------------------------
// Market summary (lighter model for batch work)
// ---------------------------------------------------------------------------

/**
 * Generate a market summary using a lighter model for cost efficiency.
 */
export async function generateMarketSummary(prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (block.type === 'text') return block.text;
  throw new Error('Unexpected response type from Claude API');
}
