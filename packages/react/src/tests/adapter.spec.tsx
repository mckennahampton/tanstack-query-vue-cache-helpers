import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { reactAdapter } from '../hooks/useTanstackCacheHelpers/helpers/adapter'

describe('reactAdapter', () => {
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame | undefined;

  beforeEach(() => {
    vi.useFakeTimers(); // Enable fake timers
    originalRequestAnimationFrame = window.requestAnimationFrame;
  })

  afterEach(() => {
    // Restore the original function first
    Object.defineProperty(window, 'requestAnimationFrame', {
        value: originalRequestAnimationFrame,
        writable: true,
        configurable: true,
    });
    vi.useRealTimers(); // Restore real timers
  })

  it('should use requestAnimationFrame when available', async () => {
    // Ensure requestAnimationFrame exists for this test
    if (typeof originalRequestAnimationFrame !== 'function') {
      // Mock it if it doesn't exist in the test environment somehow
      Object.defineProperty(window, 'requestAnimationFrame', {
          value: (callback: FrameRequestCallback) => {
              const handle = setTimeout(() => callback(Date.now()), 0);
              return handle as unknown as number; // Basic mock
          },
          writable: true,
          configurable: true,
      });
    }

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    let resolved = false;

    const promise = reactAdapter.nextTick().then(() => {
        resolved = true;
    });

    expect(rafSpy).toHaveBeenCalled();

    // Allow RAF callback to execute using fake timers
    await vi.advanceTimersToNextTimerAsync(); 
    await promise; 

    expect(resolved).toBe(true);
    rafSpy.mockRestore();
  });

  it('should resolve immediately when requestAnimationFrame is not available', async () => {
    // Simulate environment where requestAnimationFrame is missing
    Object.defineProperty(window, 'requestAnimationFrame', {
        value: undefined,
        writable: true,
        configurable: true,
    });

    let resolved = false;
    // nextTick should now use the immediate resolve path
    await reactAdapter.nextTick().then(() => {
        resolved = true;
    }); 

    // Check that it resolved without needing RAF timers
    expect(resolved).toBe(true);
  });
}); 