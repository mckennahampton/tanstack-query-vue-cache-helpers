import { describe, it, expect } from 'vitest'
import { ref, type MaybeRef } from 'vue'
import { refreshArray } from '../../../utilities/arrays/refreshArray'

interface TestItem {
  value: number
}

describe('refreshArray', () => {
  it('should handle null/undefined array that is a ref', () => {
    const arrayRef = ref<TestItem[]>([])
    const newItems = [{ value: 1 }, { value: 2 }, { value: 3 }]

    refreshArray({
      array: arrayRef,
      newItems,
      truncate: true,
      identityKey: 'value'
    })

    expect(arrayRef.value).toEqual(newItems)
  })

  it('should handle null/undefined array that is not a ref', () => {
    let array: MaybeRef<TestItem[]> | undefined = undefined
    const newItems = [{ value: 1 }, { value: 2 }, { value: 3 }]

    array = refreshArray({
      //@ts-expect-error
      array,
      newItems,
      truncate: true,
      identityKey: 'value'
    })

    expect(array).toEqual(newItems)
  })

  it('should handle null/undefined array that is a ref', () => {
    const arrayRef = ref<null | undefined>(null)
    const newItems = [{ value: 1 }, { value: 2 }, { value: 3 }]

    refreshArray({
      //@ts-expect-error
      array: arrayRef,
      newItems,
      truncate: true,
      identityKey: 'value'
    })

    expect(arrayRef.value).toEqual(newItems)
  })

  it('should mutate existing array to maintain reactivity', () => {
    const array = [{ value: 1 }, { value: 2 }, { value: 3 }]
    const newItems = [{ value: 4 }, { value: 5 }, { value: 6 }]

    refreshArray({
      array,
      newItems,
      truncate: true,
      identityKey: 'value'
    })

    expect(array).toEqual(newItems)
  })

  it('should unshift single item when not truncating', () => {
    const array = [{ value: 1 }, { value: 2 }, { value: 3 }]
    const newItems = [{ value: 0 }]

    refreshArray({
      array,
      newItems,
      truncate: false,
      identityKey: 'value',
      newItemsLocation: 'front'
    })

    expect(array).toEqual([{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }])
  })
}) 