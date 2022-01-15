import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../../images/logo.png';
import { useState } from 'react';

const NavbarItem = ({title, classProps}) =>{
    return(
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    )
}

const Navbar = () =>  {

    const [toggleMenu, setToggleMenu] = useState(false);

    return(
    <nav className='w-full flex md:justify-center justify-between items-center p-4'>
        <div className='md:flex-[0.5] flex-initial justify-center items-center'>
            <img src={logo} alt='logo' className='w-32 cursor-pointer' />
        </div>

        <ul className='text-white md:flex hidden list-none items-center flex-row justify-between'>
            {["Market","Exchange","Tutorials","Wallets"].map((item, index)=>(
                <NavbarItem key={item+index} title={item }/>
            ))}
            <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>Login</li>

        </ul>

        <div className='flex relative'>
            {toggleMenu ? <AiOutlineClose className='text-white md:hidden cursor-pointer' onClick={()=> setToggleMenu(false)} fontSize={28} /> : <HiMenuAlt4 className='text-white md:hidden cursor-pointer' onClick={()=> setToggleMenu(true)} fontSize={28} />}
            { toggleMenu && (
              <ul
                className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2x1 md:hidden list-none 
                flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in
                "
              >
                  <li className='text-xl w-full my-2 '>
                  <AiOutlineClose className='text-white md:hidden cursor-pointer' onClick={()=> setToggleMenu(false)} fontSize={28} />
                  </li>
                  {["Market","Exchange","Tutorials","Wallets"].map((item, index)=>(
                <NavbarItem key={item+index} title={item } classProps="my-2 text-lg" />
            ))}
              </ul>
            ) }
        </div>

    </nav>
    );
}

export default Navbar;