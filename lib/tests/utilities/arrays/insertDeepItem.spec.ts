import { describe, it, expect, vi } from 'vitest'
import { insertDeepItem } from '../../../utilities/arrays/insertDeepItem'

interface DeepItem {
  id: number
  name: string
  parentId?: number
  children?: DeepItem[]
}

describe('insertDeepItem', () => {
  it('should log error when parent is not found', () => {
    const array: DeepItem[] = [
      { id: 1, name: 'Parent 1', children: [] },
      { id: 2, name: 'Parent 2', children: [] }
    ]

    const newItem: DeepItem = {
      id: 3,
      name: 'Child Item',
      parentId: 999 // Non-existent parent ID
    }

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    insertDeepItem({
      array,
      item: newItem,
      childKey: 'children',
      parentKey: 'parentId'
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Could not find parent item to house new item',
      expect.objectContaining({
        newItem,
        parentKey: 'parentId',
        childKey: 'children',
        array: expect.any(Array)
      })
    )

    consoleSpy.mockRestore()
  })

  it('should insert item at root level when parentId is not provided', () => {
    const array: DeepItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]

    const newItem: DeepItem = {
      id: 3,
      name: 'New Root Item'
      // No parentId provided
    }

    insertDeepItem({
      array,
      item: newItem,
      childKey: 'children',
      parentKey: 'parentId'
    })

    expect(array).toHaveLength(3)
    expect(array[2]).toEqual(newItem)
  })
}) 