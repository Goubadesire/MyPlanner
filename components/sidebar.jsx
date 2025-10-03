import Link from "next/link";
import Style from '../styles/sidebar.module.css'
import { IoIosHome } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-base-200 shadow-lg flex flex-col">
      {/* Logo / Titre */}
      <div className={` ${Style.sidebarHeader}`}>
        <h2 className="text-xl font-bold text-white">My Planner</h2>
      </div>

      {/* Navigation */}
      <ul className={`menu mt-4 flex-1 ${Style.sidebarMenu}`}>
        <li>
          <Link href="/dashboard" className="flex items-center gap-3 hover:bg-base-300 rounded-lg">
            <IoIosHome size={20} color="#FACC15"/>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/Etude" className="flex items-center gap-3 hover:bg-base-300 rounded-lg">
          <FaBookOpen size={20} color="#3B82F6"/>
            Etude
          </Link>
        </li>
        <li>
          <Link href="/Tasks" className="flex items-center gap-3 hover:bg-base-300 rounded-lg">
          <FaTasks size={20} color="#F97316"/>
            Tache
          </Link>
        </li>
        <li>
          <Link href='/Finance' className="flex items-center gap-3 hover:bg-base-300 rounded-lg">
            <GiPayMoney size={20} color="#10B981"/>
            Finances
          </Link>
        </li>
        <li>
          <Link href='/Finance' className="flex items-center gap-3 hover:bg-base-300 rounded-lg">
          <FiLogOut size={20} color="#EF4444"/>
            Deconnexion
          </Link>
        </li>
      </ul>
    </div>
  );
}
