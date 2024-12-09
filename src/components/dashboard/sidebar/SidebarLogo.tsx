import { Link } from "react-router-dom";

export const SidebarLogo = () => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <Link to="/" className="flex items-center">
        <img 
          src="https://i.imghippo.com/files/uafE3798xA.png" 
          alt="Navig Logo" 
          className="h-8 w-auto"
        />
      </Link>
    </div>
  );
};