export const Loading = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className={`${sizes[size]} border-primary border-t-transparent rounded-full animate-spin`}></div>
            {text && <p className="text-gray-600 text-sm">{text}</p>}
        </div>
    );
};
