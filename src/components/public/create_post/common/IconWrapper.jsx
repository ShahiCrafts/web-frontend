export default function IconWrapper({ icon: Icon, className = '' }) {
    return <>
        <Icon className={`w-5 h-5 ${className}`} strokeWidth={1.5} />
    </>
};