import Course from '@/database/course.modal';
import { connectToDatabase } from '@/lib/mongoose';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const CoursesPage = async () => {
  const userId = auth();

  if (!userId) {
    return redirect("/");
  }


  // Remove the getToken property from the userId object.
  const { getToken, ...userIdWithoutToken } = userId;

  connectToDatabase();
  const courses = await Course.find({ userId: userIdWithoutToken.userId }).sort({ createdAt: -1 });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage