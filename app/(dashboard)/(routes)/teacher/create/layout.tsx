import { Metadata } from "next";

//Made this layout just to add metadata outside client component
export const metadata: Metadata = {
    title: "LMS CR | Create New Course",
    description: "Modern LMS Solution",
    icons: {
        icon: "/icons/newLogo.svg"
    }
};
const CreateLayout = async ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default CreateLayout;