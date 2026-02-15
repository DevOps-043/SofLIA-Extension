/**
 * IRIS Action Parser
 *
 * Parses :::IRIS_ACTION::: blocks from Gemini responses,
 * executes them via iris-data.ts, and cleans the display text.
 */

import { executeIrisAction, IrisActionRequest, IrisActionResult } from './iris-data';

const ACTION_REGEX = /:::IRIS_ACTION:::([\s\S]*?):::END_ACTION:::/g;

/** Check if the response text contains IRIS action blocks */
export function hasIrisActions(text: string): boolean {
  return text.includes(':::IRIS_ACTION:::');
}

/** Extract all IRIS action blocks from the response text */
export function parseIrisActions(text: string): IrisActionRequest[] {
  const actions: IrisActionRequest[] = [];
  let match: RegExpExecArray | null;

  // Reset lastIndex for global regex
  ACTION_REGEX.lastIndex = 0;

  while ((match = ACTION_REGEX.exec(text)) !== null) {
    try {
      const jsonStr = match[1].trim();
      const parsed = JSON.parse(jsonStr) as IrisActionRequest;
      if (parsed.type) {
        actions.push(parsed);
      }
    } catch (e) {
      console.error('IRIS Actions: Failed to parse action block:', e);
    }
  }

  return actions;
}

/** Remove IRIS action blocks from the text (for clean display) */
export function cleanIrisActionMarkers(text: string): string {
  ACTION_REGEX.lastIndex = 0;
  return text.replace(ACTION_REGEX, '').trim();
}

/** Execute all parsed IRIS actions and return results */
export async function executeAllIrisActions(actions: IrisActionRequest[], userId?: string): Promise<IrisActionResult[]> {
  const results: IrisActionResult[] = [];

  for (const action of actions) {
    console.log('IRIS Actions: Executing', action.type, action.id || '');
    const result = await executeIrisAction(action, userId);
    console.log('IRIS Actions: Result', result.success ? 'OK' : result.error);
    results.push(result);
  }

  return results;
}
