import ProtectedRoute from '@/components/protected-route'

const Annotation = ({ params: { id } }: { params: { id: string } }) => {
    console.log(id)

    return <ProtectedRoute>annotation {id}</ProtectedRoute>
}
export default Annotation
