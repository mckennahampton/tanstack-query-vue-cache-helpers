import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { removeArrayItem } from '../../../utilities/arrays/removeArrayItem'

interface TestItem {
  id: number
  value: string
}

describe('removeArrayItem', () => {
  it('should remove item from ref array', () => {
    const arrayRef = ref<TestItem[]>([
      { id: 1, value: 'Item 1' },
      { id: 2, value: 'Item 2' },
      { id: 3, value: 'Item 3' }
    ])

    removeArrayItem({
      array: arrayRef,
      identityValues: [2],
      identityKey: 'id'
    })

    expect(arrayRef.value).toEqual([
      { id: 1, value: 'Item 1' },
      { id: 3, value: 'Item 3' }
    ])
  })

  it('should remove item from non-ref array', () => {
    const array: TestItem[] = [
      { id: 1, value: 'Item 1' },
      { id: 2, value: 'Item 2' },
      { id: 3, value: 'Item 3' }
    ]

    removeArrayItem({
      array,
      identityValues: [2],
      identityKey: 'id'
    })

    expect(array).toEqual([
      { id: 1, value: 'Item 1' },
      { id: 3, value: 'Item 3' }
    ])
  })
}) 