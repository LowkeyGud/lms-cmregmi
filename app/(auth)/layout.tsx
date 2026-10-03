import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LMS CR",
    description: "Modern LMS Solution",
};
const AuthLayout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <div
            className="h-full flex items-center justify-center"
        >
            {children}</div>

    );
}

export default AuthLayout;