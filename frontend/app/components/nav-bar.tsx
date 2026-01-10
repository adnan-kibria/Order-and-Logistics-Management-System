import Link from "next/link";

export default function NavBar(){
  return (
    <>
      <div className="navbar bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md px-4 text-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><Link href={"/"}>Home</Link></li>
              <li><Link href={"/about"}>About</Link></li>
              <li><Link href={"/contract"}>Contract</Link></li>
            </ul>
          </div>
          <Link href={"/"} className="font-bold">SHOP-ONLINE</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link href={"/"}>Home</Link></li>
            <li><Link href={"/about"}>About</Link></li>
            <li><Link href={"/contract"}>Contract</Link></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          <Link href={"/signin"} className="btn bg-white-100 hover:bg-indigo-500 hover:text-white border-none">Sign In</Link>
        </div>
      </div>
    </>
  )
}