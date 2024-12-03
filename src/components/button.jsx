import { usePathname, useRouter } from 'next/navigation';

function Button({ placeholder, direct_to, path_name }) {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <button
            className={`px-3 py-1 border-secondary hover:border-b-[6px] hover:py-0 flex items-center  text-md font-medium ${pathname === `${path_name}` ? 'border-b-[6px]' : 'border-b-2'} transition-all duration-100`}
            onClick={() => router.push(`${direct_to}`)}
        >
            {placeholder}
        </button>
    )
}

export default Button