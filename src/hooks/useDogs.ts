import { useCallback, useEffect, useReducer, useRef } from 'react'
import { fetchRandomDogs } from '../api/dogs'
import type { DogImage } from '../domain/dog'

interface DogsState {
  status: 'loading' | 'success' | 'error'
  dogs: DogImage[]
  mainDog: DogImage | null
  error: string | null
}

type DogsAction =
  | { type: 'loadStarted' }
  | { type: 'loadSucceeded'; dogs: DogImage[]; resetMain: boolean }
  | { type: 'loadFailed'; message: string }
  | { type: 'mainSelected'; dog: DogImage }

const initialState: DogsState = {
  status: 'loading',
  dogs: [],
  mainDog: null,
  error: null,
}

function reducer(state: DogsState, action: DogsAction): DogsState {
  switch (action.type) {
    case 'loadStarted':
      return { ...state, status: 'loading', error: null }
    case 'loadSucceeded':
      return {
        status: 'success',
        dogs: action.dogs,
        mainDog:
          action.resetMain || !state.mainDog
            ? (action.dogs[0] ?? null)
            : state.mainDog,
        error: null,
      }
    case 'loadFailed':
      return { ...state, status: 'error', error: action.message }
    case 'mainSelected':
      return { ...state, status: 'success', mainDog: action.dog, error: null }
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return 'The request timed out. Please try again.'
  }
  if (error instanceof TypeError) {
    return 'Could not reach the Dog API. Check your connection and try again.'
  }
  if (error instanceof Error) return error.message
  return 'Failed to load dogs. Please try again.'
}

export function useDogs() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const activeRequest = useRef<AbortController | null>(null)
  const selectionVersion = useRef(0)

  const request = useCallback(async (showLoading: boolean) => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    const versionAtStart = selectionVersion.current

    if (showLoading) dispatch({ type: 'loadStarted' })

    try {
      const dogs = await fetchRandomDogs(10, { signal: controller.signal })
      if (controller.signal.aborted) return
      if (dogs.length === 0) {
        dispatch({
          type: 'loadFailed',
          message: 'No dogs found. Please try again.',
        })
        return
      }
      dispatch({
        type: 'loadSucceeded',
        dogs,
        resetMain: selectionVersion.current === versionAtStart,
      })
    } catch (error) {
      if (controller.signal.aborted) return
      dispatch({ type: 'loadFailed', message: getErrorMessage(error) })
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null
      }
    }
  }, [])

  useEffect(() => {
    void request(false)
    return () => {
      activeRequest.current?.abort()
    }
  }, [request])

  const selectMain = useCallback((dog: DogImage) => {
    selectionVersion.current += 1
    dispatch({ type: 'mainSelected', dog })
  }, [])

  const reload = useCallback(() => {
    void request(true)
  }, [request])

  return {
    dogs: state.dogs,
    mainDog: state.mainDog,
    loading: state.status === 'loading',
    error: state.error,
    hasData: state.dogs.length > 0 || state.mainDog !== null,
    reload,
    selectMain,
  }
}
