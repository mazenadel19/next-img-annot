export interface User {
    id: string
    email: string
    createdAt: string
}

export interface Task {
    id?: string
    createdAt: string
    imageURL: string
    description: string
    assignedTo: string
    status: 'Pending' | 'InProgress' | 'Completed'
    annotations:
        | []
        | [
              {
                  rectangles: {
                      x: number
                      y: number
                      width: number
                      height: number
                  }[]
                  annotation: string
              },
          ]
}
