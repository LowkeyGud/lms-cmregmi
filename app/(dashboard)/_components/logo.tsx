import Image from "next/image"
import Link from "next/link"


export const Logo = () => {
    return (
        <>
            <Link href="/dashboard">
                <Image

                    src="/logo.png"
                    alt="Logo"
                    width={130}
                    height={130}
                />
            </Link>
        </>
    )
}