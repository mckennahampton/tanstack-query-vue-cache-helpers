import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { removeDeepItem } from '../../../utilities/arrays/removeDeepItem'


interface Item {
  id: number
  name: string
  children?: Item[]
  parent_id?: number | null
}

type ItemKey = keyof Item

describe('removeDeepItem', () => {
  it('should remove root-level item when provided as number', () => {
    const array: Item[] = [
      { id: 1, name: 'Item 1', children: [] },
      { id: 2, name: 'Item 2', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ]

    removeDeepItem({
      array,
      oldItem: 2,
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(array).toEqual([
      { id: 1, name: 'Item 1', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])
  })

  it('should handle number not found in root array', () => {
    const array: Item[] = [
      { id: 1, name: 'Item 1', children: [] },
      { id: 2, name: 'Item 2', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ]

    // Try to remove a non-existent ID
    removeDeepItem({
      array,
      oldItem: 999,
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    // Array should remain unchanged
    expect(array).toEqual([
      { id: 1, name: 'Item 1', children: [] },
      { id: 2, name: 'Item 2', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])
  })

  it('should remove nested item when provided as number', () => {
    const array: Item[] = [
      { 
        id: 1, 
        name: 'Item 1', 
        children: [
          { id: 4, name: 'SubItem 4', parent_id: 1 },
          { id: 5, name: 'SubItem 5', parent_id: 1 }
        ] 
      },
      { 
        id: 2, 
        name: 'Item 2', 
        children: [
          { id: 6, name: 'SubItem 6', parent_id: 2 }
        ] 
      }
    ]

    removeDeepItem({
      array,
      oldItem: 5,
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(array[0].children).toEqual([
      { id: 4, name: 'SubItem 4', parent_id: 1 }
    ])
  })

  it('should remove root-level item when provided as object', () => {
    const array = ref<Item[]>([
      { id: 1, name: 'Item 1', children: [] },
      { id: 2, name: 'Item 2', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])

    removeDeepItem({
      array,
      oldItem: { id: 2, name: 'Item 2', children: [] },
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(array.value).toEqual([
      { id: 1, name: 'Item 1', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])
  })

  it('should remove nested item when provided as object with parent key', () => {
    const array = ref<Item[]>([
      { 
        id: 1, 
        name: 'Item 1', 
        children: [
          { id: 4, name: 'SubItem 4', parent_id: 1 },
          { id: 5, name: 'SubItem 5', parent_id: 1 }
        ] 
      },
      { 
        id: 2, 
        name: 'Item 2', 
        children: [
          { id: 6, name: 'SubItem 6', parent_id: 2 }
        ] 
      }
    ])


    removeDeepItem({
      array,
      oldItem: { id: 5, name: 'SubItem 5', children: [], parent_id: 1 },
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(array.value[0].children).toEqual([
      { id: 4, name: 'SubItem 4', parent_id: 1 }
    ])
  })

  it('should log error when parent is not found for nested item', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    const array: Item[] = [
      { 
        id: 1, 
        name: 'Item 1', 
        children: [
          { id: 4, name: 'SubItem 4', parent_id: 1 }
        ] 
      }
    ]

    removeDeepItem({
      array,
      oldItem: { id: 999, name: 'Non-existent', children: [], parent_id: 2 },
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Could not find parent item to remove nested item',
      expect.objectContaining({
        oldItem: { id: 999, name: 'Non-existent', children: [], parent_id: 2 },
        parentKey: 'parent_id',
        childKey: 'children'
      })
    )
  })

  // it('should remove root-level item when provided as object without parent key', () => {
  //   const array = ref<Item[]>([
  //     { id: 1, name: 'Item 1', children: [], parent_id: null },
  //     { id: 2, name: 'Item 2', children: [] },
  //     { id: 3, name: 'Item 3', children: [] }
  //   ])

  //   // Create an item that exists in the root array
  //   const itemToRemove = { id: 2, name: 'Item 2' }

  //   removeDeepItem<Item>({
  //     array,
  //     oldItem: itemToRemove,
  //     childKey: 'children',
  //     parentKey: 'parent_id',
  //     identityKey: 'id'
  //   })

  //   expect(array.value).toEqual([
  //     { id: 1, name: 'Item 1', children: [] },
  //     { id: 3, name: 'Item 3', children: [] }
  //   ])
  // })

  it('should remove root-level item when provided as object with matching identity', () => {
    const array = ref<Item[]>([
      { id: 1, name: 'Item 1', children: [] },
      { id: 2, name: 'Item 2', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])

    // Create an item that exists in the root array with matching id
    const itemToRemove = { id: 2, name: 'Item 2', parent_id: undefined }

    removeDeepItem<Item>({
      array,
      oldItem: itemToRemove,
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(array.value).toEqual([
      { id: 1, name: 'Item 1', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])
  })

  it('should remove root-level item when provided as number with matching identity', () => {
    const array = ref<Item[]>([
      { id: 1, name: 'Item 1', children: [] },
      { id: 2, name: 'Item 2', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])

    // Create an item that exists in the root array with matching id
    const itemToRemove = 2

    removeDeepItem<Item>({
      array,
      oldItem: itemToRemove,
      childKey: 'children',
      parentKey: 'parent_id',
      identityKey: 'id'
    })

    expect(array.value).toEqual([
      { id: 1, name: 'Item 1', children: [] },
      { id: 3, name: 'Item 3', children: [] }
    ])
  })
}) 