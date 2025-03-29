import { describe, it, expect } from 'vitest'
import { updateDeepItem } from '../../../utilities/arrays/updateDeepItem'

interface TestItem {
    id: number
    name: string
    parentId: number | null
    children?: TestItem[]
}

describe('updateDeepItem', () => {
    it('should move an item to a new parent when parentId changes', () => {
        // Create initial tree structure
        const initialArray: TestItem[] = [
            {
                id: 1,
                name: 'Parent 1',
                parentId: null,
                children: [
                    {
                        id: 2,
                        name: 'Child 1',
                        parentId: 1,
                        children: []
                    }
                ]
            },
            {
                id: 3,
                name: 'Parent 2',
                parentId: null,
                children: []
            }
        ]

        // Create updated item that should move from Parent 1 to Parent 2
        const updatedItem: TestItem = {
            id: 2,
            name: 'Child 1',
            parentId: 3, // Changed from 1 to 3
            children: []
        }

        // Update the item
        updateDeepItem({
            array: initialArray,
            item: updatedItem,
            childKey: 'children',
            parentKey: 'parentId'
        })

        // Verify the item has been moved
        expect(initialArray[0].children).toHaveLength(0)
        expect(initialArray[1].children).toHaveLength(1)
        expect(initialArray[1].children![0]).toEqual(updatedItem)
    })

    it('should handle moving an item to root level', () => {
        // Create initial tree structure
        const initialArray: TestItem[] = [
            {
                id: 1,
                name: 'Parent 1',
                parentId: null,
                children: [
                    {
                        id: 2,
                        name: 'Child 1',
                        parentId: 1,
                        children: []
                    }
                ]
            }
        ]

        // Create updated item that should move to root level
        const updatedItem: TestItem = {
            id: 2,
            name: 'Child 1',
            parentId: null, // Changed to null to make it a root item
            children: []
        }

        // Update the item
        updateDeepItem({
            array: initialArray,
            item: updatedItem,
            childKey: 'children',
            parentKey: 'parentId'
        })

        // Verify the item has been moved to root level
        expect(initialArray[0].children).toHaveLength(0)
        expect(initialArray).toHaveLength(2)
        expect(initialArray[1]).toEqual(updatedItem)
    })
}) 