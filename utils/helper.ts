import { arrayUnion, collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import { Task, User } from './types'

export const tasksSeeder = async () => {
    const tasksRef = collection(db, 'tasks')
    const usersRef = collection(db, 'users') // Reference to users collection
    const batch = writeBatch(db) // Create a write batch

    // Fetch users to randomly assign tasks
    const users = await fetchUsers()

    Array.from({ length: 150 }, (_, index) => {
        // Randomly select a user
        const randomUser = users[Math.floor(Math.random() * users.length)]

        const task: Task = {
            description: `Task ${index + 1}`,
            assignedTo: randomUser.id, // Assign task to random user
            status: index % 3 === 0 ? 'Pending' : index % 3 === 1 ? 'InProgress' : 'Completed',
            imageURL: `https://picsum.photos/800/800?random=${Math.random()}`,
            createdAt: new Date().toISOString(),
            annotations: [],
        }

        // Add the task to the batch
        const taskRef = doc(tasksRef) // Get a new document reference
        batch.set(taskRef, task) // Add a `set` operation to the batch

        // Update the user's tasks array in the batch (append task ID using arrayUnion)
        const userRef = doc(usersRef, randomUser.id)
        batch.update(userRef, {
            tasks: arrayUnion(taskRef.id), // Append task ID to the tasks array
        })

        return task
    })

    try {
        // Commit the batch to Firestore in a single request
        await batch.commit()
        console.log('All tasks added successfully in batch')
    } catch (error) {
        console.error('Error adding tasks:', error)
    }
}

export const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as User[]
}
