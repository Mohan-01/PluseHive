export function getLogLocation(depth = 3) {
  const err = new Error();
  const stack = err.stack?.split('\n') ?? [];
  const caller = stack[depth]?.trim();
  if (!caller) return { file: 'unknown', method: 'anonymous', line: '?' };

  const match = caller.match(/at (?:(.+?) )?\(?(.+):(\d+):(\d+)\)?/);

  if (!match) return { file: 'unknown', method: 'anonymous', line: '?' };

  const [, method = 'anonymous', filePath, line, column] = match;
  const file = filePath.split('/').pop() || filePath;

  return {
    file,
    method,
    line: `${line}:${column}`,
  };
}
