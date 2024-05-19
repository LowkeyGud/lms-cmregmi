import { redirect } from "next/navigation";
import { Categories } from "./_components/categories";
import Category from "@/database/category.modal";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

// import { SearchInput } from "@/components/search-input";
// import { getCourses } from "@/actions/get-courses";
// import { CoursesList } from "@/components/courses-list";


interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  connectToDatabase()
  const categories = await Category.find().sort({ name: 1 });


  const courses = await getCourses({
    userId,
    ...searchParams,
  });


  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories
          items={categories}
        />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;