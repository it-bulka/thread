import { NextResponse } from 'next/server';
import { Result } from '@/lib/result';

export function handleError<T, K extends any[]>(asyncFunc: (...args: K) => Promise<T>, onError?: () => string): (...args: K) => Promise<Result<T>> {
  return async (...args: K) => {
    try {
      const data = await asyncFunc(...args);
      return { ok: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error'
      const label = onError ? `${onError()}: ${msg}` : msg
      console.error('[handleError]', label)
      return { ok: false, error: label }
    }
  }
}


export function handleApiError<T, K extends any[]>(asyncFunc: (...args: K) => Promise<T>, onError?: () => { message: string, status: number}): (...args: K) => Promise<T | NextResponse<{   message: string; }> | undefined> {
  return async (...args: K) => {
    try {
      return await asyncFunc(...args);
    } catch (err: unknown) {
      console.log('apiError', err)
      const params = onError && onError()
      if (params) {
        return NextResponse.json(params)
      }

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }
}



